def start(landscape, platform, service, port, live):

    # build API image
    api_image_name = platform + "-" + service + "-api"
    docker_build(
        api_image_name,
        '.',
        dockerfile = './infra/Dockerfile',
    )

    # build migration image
    migration_image_name = platform + "-" + service + "-migration"
    docker_build(
        migration_image_name,
        '.',
        dockerfile = './infra/migrate.Dockerfile',
    )

    # Add Link
    k8s_resource(
       workload = api_image_name,
       links=[
         link('http://api.' + service + '.' + platform + '.' + landscape +  '.lvh.me:' + str(port) + '/api-docs','API')
       ]
    )
