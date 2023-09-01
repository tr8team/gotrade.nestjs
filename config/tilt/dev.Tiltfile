def start(landscape, platform, service, port, live):

    # Build API
    api_image_name = platform + "-" + service + "-api"
    docker_build(
        api_image_name,
        '.',
        dockerfile = './infra/dev.Dockerfile',
        entrypoint='nest start --watch',
        live_update=[
            sync('.', '/app'),
        ]
    )

    # Add Link
    k8s_resource(
       workload = api_image_name,
       links=[
         link('http://api.' + service + '.' + platform + '.' + landscape +  '.lvh.me:' + str(port) + '/api-docs','API')
       ]
    )
