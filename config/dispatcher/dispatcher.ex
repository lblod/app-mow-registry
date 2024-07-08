defmodule Dispatcher do
  use Matcher

  define_accept_types [
    html: ["text/html", "application/xhtml+html"],
    json: ["application/json", "application/vnd.api+json"],
    upload: ["multipart/form-data"],
    sparql: [ "application/sparql-results+json" ],
    any: [ "*/*" ],
  ]

  define_layers [ :api, :frontend, :not_found]

  options "/*path", _ do
    conn
    |> Plug.Conn.put_resp_header( "access-control-allow-headers", "content-type,accept" )
    |> Plug.Conn.put_resp_header( "access-control-allow-methods", "*" )
    |> send_resp( 200, "{ \"message\": \"ok\" }" )
  end

  ###############
  # SPARQL
  ###############
  match "/sparql", %{ layer: :api, accept: %{ sparql: true } } do
    forward conn, [], "http://sparql-cache/sparql"
  end

  ###############################################################
  # domain.json
  ###############################################################
  match "/code-lists/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/code-lists/"
  end
  match "/road-sign-concepts/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/road-sign-concepts/"
  end

  match "/road-sign-concept-status/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/road-sign-concept-status/"
  end

  match "/road-sign-concept-status-codes/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/road-sign-concept-status-codes/"
  end

  match "/road-sign-categories/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/road-sign-categories/"
  end

  match "/traffic-light-concepts/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/traffic-light-concepts/"
  end

  match "/traffic-light-concept-status/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/traffic-light-concept-status/"
  end

  match "/traffic-light-concept-status-codes/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/traffic-light-concept-status-codes/"
  end

  match "/traffic-light-categories/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/traffic-light-categories/"
  end

  match "/road-marking-concepts/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/road-marking-concepts/"
  end

  match "/traffic-measure-concepts/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/traffic-measure-concepts/"
  end

  match "/road-marking-concept-status/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/road-marking-concept-status/"
  end

  match "/road-marking-concept-status-codes/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/road-marking-concept-status-codes/"
  end

  match "/road-marking-categories/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/road-marking-categories/"
  end

  match "/resources/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/resources/"
  end

  match "/shapes/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/shapes/"
  end

  match "/property-shapes/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/property-shapes/"
  end

  match "/node-shapes/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/node-shapes/"
  end

  match "/icons/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/icons/"
  end

  match "/templates/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/templates/"
  end

  match "/tribont-shapes/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/tribont-shapes/"
  end

  match "/dimensions/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/dimensions/"
  end

  match "/mappings/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/mappings/"
  end

  match "/concept-schemes/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/concept-schemes/"
  end

  match "/skos-concepts/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/skos-concepts/"
  end

  match "/concepts/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/concepts/"
  end

  match "/accounts/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/accounts/"
  end

  match "/groups/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/groups/"
  end

  match "/images/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/images/"
  end


  ###############################################################
  # login specific
  ###############################################################
  match "/mock/sessions/*path", %{ accept: %{any: true}, layer: :api} do
    Proxy.forward conn, path, "http://mocklogin/sessions/"
  end

  match "/sessions/*path", %{ accept: %{any: true}, layer: :api} do
    Proxy.forward conn, path, "http://login/sessions/"
  end

  ###############################################################
  # files
  ###############################################################
  get "/files/:id/download", %{ accept: %{any: true}, layer: :api} do
    Proxy.forward conn, [], "http://file/files/" <> id <> "/download"
  end
  get "/files/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/files/"
  end
  patch "/files/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://cache/files/"
  end
  post "/files/*path", %{ accept: %{upload: true}, layer: :api} do
    Proxy.forward conn, path, "http://file/files/"
  end
  delete "/files/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://file/files/"
  end

  ###############################################################
  # static files
  ###############################################################
  get "/static/*path", %{ accept: %{any: true}, layer: :api} do
    Proxy.forward conn, path, "http://static-file/static/"
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

  match "/*path", %{ accept: %{html: true}, layer: :api } do
    Proxy.forward conn, [], "http://frontend/index.html"
  end

  match "/*_path", %{ layer: :frontend } do
    Proxy.forward conn, [], "http://frontend/index.html"
  end

  ###############################################################
  # errors
  ###############################################################
  match "/*_path", %{ accept: %{any: true}, layer: :not_found} do
    send_resp( conn, 404, "{\"error\": {\"code\": 404}")
  end


end
