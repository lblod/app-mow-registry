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
    forward conn, [], "http://db:8890/sparql"
  end
  
  ###############################################################
  # domain.json
  ###############################################################
  match "/code-lists/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/code-lists/"
  end

  match "/code-list-options/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/code-list-options/"
  end

  match "/road-sign-concepts/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/road-sign-concepts/"
  end

  match "/road-sign-concepts/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/road-sign-concepts/"
  end

  match "/road-sign-concept-status/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/road-sign-concept-status/"
  end

  match "/road-sign-concept-status-codes/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/road-sign-concept-status-codes/"
  end

  match "/road-sign-categories/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/road-sign-categories/"
  end
  
  match "/traffic-light-concepts/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/traffic-light-concepts/"
  end

  match "/traffic-light-concept-status/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/traffic-light-concept-status/"
  end

  match "/traffic-light-concept-status-codes/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/traffic-light-concept-status-codes/"
  end

  match "/traffic-light-categories/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/traffic-light-categories/"
  end
  
  match "/road-marking-concepts/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/road-marking-concepts/"
  end

  match "/traffic-measure-concepts/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/traffic-measure-concepts/"
  end

  match "/road-marking-concept-status/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/road-marking-concept-status/"
  end

  match "/road-marking-concept-status-codes/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/road-marking-concept-status-codes/"
  end

  match "/road-marking-categories/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/road-marking-categories/"
  end

  match "/resources/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/resources/"
  end

  match "/shapes/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/shapes/"
  end

  match "/property-shapes/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/property-shapes/"
  end

  match "/node-shapes/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/node-shapes/"
  end

  match "/templates/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/templates/"
  end

  match "/mappings/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/mappings/"
  end

  match "/relations/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/relations/"
  end

  match "/can-be-combined-with-relations/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/can-be-combined-with-relations/"
  end

  match "/must-use-relations/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/must-use-relations/"
  end

  match "/concepts/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/concepts/"
  end

  match "/accounts/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/accounts/"
  end
  
  match "/groups/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/groups/"
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
    Proxy.forward conn, path, "http://resource/files/"
  end
  patch "/files/*path", %{ accept: %{json: true}, layer: :api} do
    Proxy.forward conn, path, "http://resource/files/"
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
