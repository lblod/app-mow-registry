defmodule Dispatcher do
  use Matcher

  define_accept_types [
    html: ["text/html", "application/xhtml+html"],
    json: ["application/json", "application/vnd.api+json"],
    upload: ["multipart/form-data"],
    any: [ "*/*" ],
  ]

  define_layers [ :api, :frontend, :not_found ]

  ###############################################################
  # domain.json
  ###############################################################
  match "/road-sign-concept-status-codes/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/road-sign-concept-status-codes/"
  end

  match "/road-sign-concept-status/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/road-sign-concept-status/"
  end

  match "/road-sign-categories/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/road-sign-categories/"
  end

  match "/road-sign-concepts/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/road-sign-concepts/"
  end

  match "/sub-signs/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/sub-signs/"
  end

  match "/related-road-sign-concepts/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/related-road-sign-concepts/"
  end

  match "/road-sign-combinations/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/road-sign-combinations/"
  end

  match "/measure-concepts/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/measure-concepts/"
  end

  ###############################################################
  # files
  ###############################################################
  get "/files/:id/download", %{ accept: [:any], layer: :api} do
    Proxy.forward conn, [], "http://file/files/" <> id <> "/download"
  end
  get "/files/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/files/"
  end
  patch "/files/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/files/"
  end
  post "/files/*path", %{ accept: [:upload], layer: :api} do
    Proxy.forward conn, path, "http://file/files/"
  end
  delete "/files/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://file/files/"
  end

  ###############################################################
  # frontend layer
  ###############################################################
  match "/assets/*path", %{ layer: :api } do
    Proxy.forward conn, path, "http://frontend/assets/"
  end

  match "/@appuniversum/*path", %{ layer: :api } do
    Proxy.forward conn, path, "http://frontend/@appuniversum/"
  end

  match "/*path", %{ accept: [:html], layer: :api } do
    Proxy.forward conn, [], "http://frontend/index.html"
  end

  match "/*_path", %{ layer: :frontend } do
    Proxy.forward conn, [], "http://frontend/index.html"
  end

  ###############################################################
  # errors
  ###############################################################
  match "/*_path", %{ accept: [:any], layer: :not_found} do
    send_resp( conn, 404, "{\"error\": {\"code\": 404}")
  end
  

end
