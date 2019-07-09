proxy_cache_path /data levels=1:2 keys_zone=ssr:1440m max_size=10g 
                 inactive=60m use_temp_path=off;

proxy_cache_methods GET;
proxy_cache_key "$scheme$request_method$host$request_uri";

map $request_method $purge_method {
    PURGE   1;
    default 0;
}

server {
  listen 4000 default_server;
  server_name  _;

  location / {
      proxy_pass ${NGINX_PROXY};
  }

  location /render/ {
      proxy_cache ssr;
      proxy_cache_lock on;
      proxy_ignore_headers Cache-Control;
      proxy_cache_valid any 30m;
      
      # proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
      # proxy_cache_background_update on;
      
      proxy_pass ${NGINX_PROXY};

      add_header X-Cache-Status $upstream_cache_status;
  }

}
