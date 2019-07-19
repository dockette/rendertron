build-rendertron:
	docker build -t dockette/rendertron ./rendertron

build-proxy:
	docker build -t dockette/rendertron:proxy ./proxy

build-tracer:
	docker build -t dockette/rendertron:tracer ./tracer

run-rendertron:
	docker run \
		-it \
		--rm \
		-p 3000:3000 \
		dockette/rendertron

run-proxy:
	docker run \
		-it \
		--rm \
		-p 4000:4000 \
		-v $(CURDIR)/tmp:/data \
		-e NGINX_PROXY=http://host.docker.internal:3000 \
		dockette/rendertron:proxy

run-tracer:
	docker run \
		-it \
		--rm \
		-e NETTE_DEBUG=1 \
		-e TRACER_SERVER=http://host.docker.internal:4000/render/ \
		-e TRACER_SRC_SITEMAP_1=https://example.com/sitemaps/pages.xml \
		-e TRACER_SRC_SITEMAP_2=https://example.com/sitemaps/pages2.xml \
		dockette/rendertron:tracer
