{{/*
Expand the name of the chart.
*/}}
{{- define "<% platform %>-<% service %>-root.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
allows triming of names
*/}}
{{- define "<% platform %>-<% service %>-root.fullname-with-suffix" -}}
{{ $fname := (include "<% platform %>-<% service %>-root.fullname" .root) }}
{{- printf "%s-%s" $fname .arg | trunc 63 | trimSuffix "-" }}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "<% platform %>-<% service %>-root.fullname" -}}
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
{{- define "<% platform %>-<% service %>-root.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "<% platform %>-<% service %>-root.labels" -}}
helm.sh/chart: {{ include "<% platform %>-<% service %>-root.chart" . }}
{{ include "<% platform %>-<% service %>-root.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
tr8.io/chart: {{ include "<% platform %>-<% service %>-root.chart" . }}
{{- range $k, $v := .Values.serviceTree }}
"tr8.io/{{ $k }}": "{{ $v }}"
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Common annotations
*/}}
{{- define "<% platform %>-<% service %>-root.annotations" -}}
{{- range $k, $v := .Values.serviceTree }}
"tr8.io/{{ $k }}": "{{ $v }}"
{{- end }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "<% platform %>-<% service %>-root.selectorLabels" -}}
app.kubernetes.io/name: {{ include "<% platform %>-<% service %>-root.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "<% platform %>-<% service %>-root.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "<% platform %>-<% service %>-root.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
