import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SpanProcessor,
} from '@opentelemetry/sdk-trace-node';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import * as process from 'process';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  ConsoleMetricExporter,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base';
import { OtelConfig } from '../config/root/otel.config';
import load from '../config/loader';
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { AppConfig } from '../config/root/app.config';

function compressionAlgoMapper(algo: string): CompressionAlgorithm {
  switch (algo) {
    case 'gzip':
      return CompressionAlgorithm.GZIP;
    case 'none':
      return CompressionAlgorithm.NONE;
    default:
      throw new Error(`Invalid compression algorithm: ${algo}`);
  }
}

function buildNodeSDK(otel: OtelConfig, app: AppConfig): NodeSDK {
  const traceExporter: SpanProcessor | undefined = (() => {
    switch (otel.trace.exporter.use) {
      case 'console':
        return new BatchSpanProcessor(new ConsoleSpanExporter());
      case 'otlp':
        const otlp = otel.trace.exporter.otlp!;
        const url = otlp.url;
        const ex = new OTLPTraceExporter({
          url: `${url}/v1/traces`,
          headers: otel.trace.exporter.otlp?.headers,
          timeoutMillis: otlp.timeout,
          compression: compressionAlgoMapper(otlp.compression),
        });
        return new BatchSpanProcessor(ex);
      case 'none':
        return undefined;
      default:
        throw new Error(
          `Invalid 'otel.trace.exporter.use': ${otel.trace.exporter.use}`,
        );
    }
  })();

  const metricsExporter = (() => {
    switch (otel.metrics.exporter.use) {
      case 'console':
        return new PeriodicExportingMetricReader({
          exportIntervalMillis: otel.metrics.exporter.interval,
          exporter: new ConsoleMetricExporter(),
        });
      case 'otlp':
        const otlp = otel.metrics.exporter.otlp!;
        const url = otlp.url;
        return new PeriodicExportingMetricReader({
          exportIntervalMillis: otel.metrics.exporter.interval,
          exporter: new OTLPMetricExporter({
            url: `${url}/v1/metrics`,
            headers: otlp.headers,
            timeoutMillis: otlp.timeout,
            compression: compressionAlgoMapper(otlp.compression),
          }),
        });
      case 'none':
        return undefined;
      default:
        throw new Error(
          `Invalid 'otel.metrics.exporter.use': ${otel.metrics.exporter.use}`,
        );
    }
  })();

  return new NodeSDK({
    serviceName: `${app.platform}-${app.service}`,
    spanProcessor: traceExporter,
    metricReader: metricsExporter,
    textMapPropagator: new CompositePropagator({
      propagators: [
        new W3CTraceContextPropagator(),
        new W3CBaggagePropagator(),
        new B3Propagator(),
        new B3Propagator({
          injectEncoding: B3InjectEncoding.MULTI_HEADER,
        }),
      ],
    }),
    autoDetectResources: false,
    contextManager: new AsyncLocalStorageContextManager(),
    instrumentations: [getNodeAutoInstrumentations()],
  });
}

const config = load();
const otelSDK = buildNodeSDK(config.otel, config.app);

otelSDK.start();
process.on('SIGTERM', () => {
  otelSDK.shutdown().finally(() => process.exit(0));
});
