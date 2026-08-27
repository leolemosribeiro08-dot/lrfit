<?php
header("Content-Type: application/json");

$accessToken = "APP_USR-37795381759637-042901-8abbbb932a97c68e3857fa93ce8fea0b-3326788488";

$dados = json_decode(file_get_contents("php://input"), true);

$itensRecebidos = $dados["itens"] ?? [];

$produtos = [
    "1" => [
        "titulo" => "Creatina Monohidratada Black Skull 300g",
        "preco" => 50.00
    ],
    "2" => [
        "titulo" => "Creatina Monohidratada Max Titanium 300g",
        "preco" => 75.00
    ],
    "3" => [
        "titulo" => "Creatina Monohidratada Growth 250g",
        "preco" => 50.00
    ],
    "4" => [
        "titulo" => "Whey Protein Concentrado 1Kg - Growth",
        "preco" => 155.00
    ],
    "5" => [
        "titulo" => "Whey Protein 100% Pote 900g - Dark Lab",
        "preco" => 150.00
    ],
    "6" => [
        "titulo" => "Creatina Monohidratada Probiótica 300g",
        "preco" => 40.00
    ],
    "7" => [
        "titulo" => "Creatina Monohidratada Black Skull 300g",
        "preco" => 50.00
    ],
    "8" => [
        "titulo" => "Creatina Monohidratada Max Titanium 300g",
        "preco" => 75.00
    ],
    "9" => [
        "titulo" => "Creatina Monohidratada Probiótica 300g",
        "preco" => 40.00
    ]
];


$itensMercadoPago = [];

foreach ($itensRecebidos as $item) {
    $id = $item["id"] ?? null;
    $quantidade = intval($item["quantidade"] ?? 1);

    if (!$id || !isset($produtos[$id])) {
        continue;
    }

    if ($quantidade < 1) {
        $quantidade = 1;
    }

    $produto = $produtos[$id];

    $itensMercadoPago[] = [
        "id" => $id,
        "title" => $produto["titulo"],
        "quantity" => $quantidade,
        "currency_id" => "BRL",
        "unit_price" => $produto["preco"]
    ];
}

if (count($itensMercadoPago) === 0) {
    http_response_code(400);
    echo json_encode(["erro" => "Carrinho vazio ou produto inválido"]);
    exit;
}

$preference = [
    "items" => $itensMercadoPago,
    "back_urls" => [
        "success" => "https://lrfit.com.br/sucesso.html",
        "failure" => "https://lrfit.com.br/erro.html",
        "pending" => "https://lrfit.com.br/pendente.html"
    ],
    "auto_return" => "approved"
];

$ch = curl_init("https://api.mercadopago.com/checkout/preferences");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $accessToken
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($preference));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo json_encode([
        "erro" => "Erro de conexão com Mercado Pago",
        "detalhes" => curl_error($ch)
    ]);
    curl_close($ch);
    exit;
}

curl_close($ch);

$resultado = json_decode($response, true);

if ($httpCode >= 200 && $httpCode < 300 && isset($resultado["init_point"])) {
    echo json_encode([
        "link" => $resultado["init_point"]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "erro" => "Erro ao criar pagamento",
        "status" => $httpCode,
        "resposta" => $resultado
    ]);
}
?>