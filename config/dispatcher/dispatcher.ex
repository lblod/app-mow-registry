defmodule Dispatcher do
  use Matcher

  define_accept_types [
    html: ["text/html", "application/xhtml+html"],
    json: ["application/json", "application/vnd.api+json"],
    any: [ "*/*" ],
  ]

  define_layers [ :api, :frontend, :not_found ]

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

  match "/road-sign-combinations/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/road-sign-combinations/"
  end

  match "/measureconcepts/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/measureconcepts/"
  end

  match "/*_path", %{ accept: [:any], layer: :not_found} do
    send_resp( conn, 404, "{\"error\": {\"code\": 404}")
  end
  

end

#IO.inspect( conn, label: "conn for /sessions" )