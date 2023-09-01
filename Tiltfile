load("./config/tilt/util.Tiltfile", "helm_watch")

# load arguments
config.define_string("config")
config.define_string("action")
config.define_string("command")
cfg = config.parse()
config_path = cfg.get('config', "config/dev.yaml")
action = cfg.get("action", "develop")

# read config file
c = read_yaml(config_path)

# service tree label
landscape = c['landscape']
platform = c['platform']
service = c['service']

mode = ''
if action == 'develop':
    mode = c['mode']
elif action == 'test':
    mode = 'test'
else:
    fail('Unknown action: ' + action)

# Read K3D config
lb_port = 0
live = ''
if mode != 'test':
    k3d_config = read_yaml('./infra/k3d.' + landscape + '.yaml')
    lb_port_mapping = k3d_config['ports'][0]['port'].split(':')
    lb_port = lb_port_mapping[0]
else:
    live = cfg.get("command","")

# common config
t = c['type']

def start_cluster(landscape, module, service, t, port, mode):
    helm_watch(landscape, module, service, t)
    if t == 'cluster':
        symbols = load_dynamic('./config/tilt/' + mode + '.Tiltfile')
        start = symbols['start']
        start(landscape, module, service, port, live)

start_cluster(landscape, platform, service, t, lb_port, mode)
