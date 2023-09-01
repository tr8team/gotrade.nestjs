{{/*
Expand the name of the chart.
*/}}
{{- define "<% platform %>-<% service %>-api.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
allows triming of names
*/}}
{{- define "<% platform %>-<% service %>-api.fullname-with-suffix" -}}
{{ $fname := (include "<% platform %>-<% service %>-api.fullname" .root) }}
{{- printf "%s-%s" $fname .arg | trunc 63 | trimSuffix "-" }}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "<% platform %>-<% service %>-api.fullname" -}}
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
{{- define "<% platform %>-<% service %>-api.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "<% platform %>-<% service %>-api.labels" -}}
helm.sh/chart: {{ include "<% platform %>-<% service %>-api.chart" . }}
{{ include "<% platform %>-<% service %>-api.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
tr8.io/chart: {{ include "<% platform %>-<% service %>-api.chart" . }}
{{- range $k, $v := .Values.serviceTree }}
"tr8.io/{{ $k }}": "{{ $v }}"
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Common annotations
*/}}
{{- define "<% platform %>-<% service %>-api.annotations" -}}
{{- range $k, $v := .Values.serviceTree }}
"tr8.io/{{ $k }}": "{{ $v }}"
{{- end }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "<% platform %>-<% service %>-api.selectorLabels" -}}
app.kubernetes.io/name: {{ include "<% platform %>-<% service %>-api.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "<% platform %>-<% service %>-api.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "<% platform %>-<% service %>-api.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

