

/* função para gerar tabela cache */
$(document).ready(function(){

    $("#gerar-cache").click(function(){

        /* guardando os parâmetros */
        const tam_cache = $("#tam_cache").val();
        const qtd_palavras = $("#qtd_palavras").val();

        /* verificando linhas da cache */
        const linhas = verifica_quantidades(tam_cache, qtd_palavras);

        /* verifica se os valores passados são potências de 2 */
        if(verifica_potencia(tam_cache, qtd_palavras) && linhas >= 1){
            $("#msg").remove();
            $("#body-table").remove();
            $("#table-info").remove();

            criar_cache(linhas);
            criar_info(tam_cache, qtd_palavras, linhas)
            
        }else{
            $("#msg").remove();
            $("#body-table").remove();
            $("#table-info").remove();

            /* adicionando mensagem de erro */
            $("#msgs").append("<div id = 'msg' class='uk-alert uk-alert-danger'>Não foi possível criar a Cache, verifique se inseriu valores aceitos.</div>")
        }

    })

})


function verifica_potencia(tam_cache, qtd_palavras){
    if(
        ((Math.log(tam_cache)/Math.log(2)) % 1 == 0)
        && ((Math.log(qtd_palavras)/Math.log(2)) % 1 == 0)
        ) return true;
    
    else return false;
    
}

function verifica_quantidades(tam_cache, qtd_palavras){

    qtd_palavras = qtd_palavras*4;
    return tam_cache/qtd_palavras;

}

function criar_cache(qtd_palavras){

    $("#table").append("<tbody id = 'body-table'></tbody>");
    
    for(var i = 0; i < qtd_palavras; i++)
        $("#body-table").append("<tr><td>"+i+"</td><td>0</td><td>-</td><td>-</td></tr>")


}

function criar_info(tam_cache, qtd_palavras, linhas){

    /* quantidade de bits do índice */
    const indice = Math.log2(linhas);
    
    /* quantidade de bits do offset */
    const offset = 2 + Math.log2(qtd_palavras);

    /* quantidade de bits da tag */
    const tag = 32 - indice - offset;

    /* adicinando na tela */
    const string = 
        "<div id = 'table-info'>"+
            "<h3 class = 'green-text margin-top'>Formato das instruções</h3>"+
            "<table class='uk-table uk-table-divider'>"+
                "<thead>"+
                    "<tr>"+
                        "<th>Tag</th>"+
                        "<th>Índice</th>"+
                        "<th>Offset</th>"+
                    "</tr>"+
                "</thead>"+
                "<tbody>"+
                    "<tr>"+
                        "<td>"+tag+"</td>"+
                        "<td>"+indice+"</td>"+
                        "<td>"+offset+"</td>"+
                    "</tr>"+
                "</tbody>"+
            "</table>"+
        "</div>";

    
    $("#div-table-info").append(string)

}