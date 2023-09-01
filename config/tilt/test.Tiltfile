def start(landscape, platform, service, port, live):


    # test_image_name
    test_image_name = platform + "-" + service + "-test"
    if live != "":
        docker_build(
            test_image_name,
            '.',
            dockerfile = './infra/test.Dockerfile',
            entrypoint=live,

            live_update=[
                sync('.', '/app'),
            ]
        )
    else:
        docker_build(
            test_image_name,
            '.',
            dockerfile = './infra/test.Dockerfile'
        )
