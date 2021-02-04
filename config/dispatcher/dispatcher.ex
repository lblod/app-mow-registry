defmodule Dispatcher do
  use Matcher

  define_accept_types [
    html: ["text/html", "application/xhtml+html"],
    json: ["application/json", "application/vnd.api+json"],
    any: [ "*/*" ],
  ]

  define_layers [ :api, :frontend, :not_found ]

  match "/roadsignconcept-status-codes/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/roadsignconcept-status-codes/"
  end

  match "/roadsigncategories/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/roadsigncategories/"
  end

  match "/roadsignconcepts/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/roadsignconcepts/"
  end

  match "/roadsigncombinations/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/roadsigncombinations/"
  end

  match "/measureconcepts/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/measureconcepts/"
  end

  match "/*_path", %{ accept: [:any], layer: :not_found} do
    send_resp( conn, 404, "{\"error\": {\"code\": 404}")
  end
  

end

#IO.inspect( conn, label: "conn for /sessions" )