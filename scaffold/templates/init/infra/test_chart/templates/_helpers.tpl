{{/*
Expand the name of the chart.
*/}}
{{- define "<% platform %>-<% service %>-test.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
allows triming of names
*/}}
{{- define "<% platform %>-<% service %>-test.fullname-with-suffix" -}}
{{ $fname := (include "<% platform %>-<% service %>-test.fullname" .root) }}
{{- printf "%s-%s" $fname .arg | trunc 63 | trimSuffix "-" }}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "<% platform %>-<% service %>-test.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "<% platform %>-<% service %>-test.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "<% platform %>-<% service %>-test.labels" -}}
helm.sh/chart: {{ include "<% platform %>-<% service %>-test.chart" . }}
{{ include "<% platform %>-<% service %>-test.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
tr8.io/chart: {{ include "<% platform %>-<% service %>-test.chart" . }}
{{- range $k, $v := .Values.serviceTree }}
"tr8.io/{{ $k }}": "{{ $v }}"
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Common annotations
*/}}
{{- define "<% platform %>-<% service %>-test.annotations" -}}
{{- range $k, $v := .Values.serviceTree }}
"tr8.io/{{ $k }}": "{{ $v }}"
{{- end }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "<% platform %>-<% service %>-test.selectorLabels" -}}
app.kubernetes.io/name: {{ include "<% platform %>-<% service %>-test.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "<% platform %>-<% service %>-test.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "<% platform %>-<% service %>-test.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

