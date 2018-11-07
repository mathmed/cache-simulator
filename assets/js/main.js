

/* função para gerar tabela cache */
$(document).ready(function(){

    /*  função que é chamada quando o botão "Gerar cache é clicado" */
    $("#gerar-cache").click(function(){

        $("#msg").remove();
        $("#table-info").remove();
        
        /* guardando os parâmetros enviados */
        var tam_memoria = $("#tam-memoria").val();
        const slots_cache = $("#slots-cache").val();
        const slots_conjunto = $("#slots-conjunto").val();
        const palavras_slot = $("#palavras-slot").val();

        /* função para validar tamanho da memória */
        tam_memoria = valida_tam_memoria(tam_memoria);

        if(tam_memoria > 0){

            /* verifica se os campos informados são potências de 2 */
            if(verifica_potencia(slots_cache, slots_conjunto, palavras_slot)){

                /* criando informações sobre a cache */
                criar_info(tam_memoria, slots_cache, slots_conjunto, palavras_slot);

            }

        }

    })

})

/* função para verificar se os campos informados são potência de 2 */
function verifica_potencia(slots_cache, slots_conjunto, palavras_slot){
    if(
        ((Math.log(slots_cache)/Math.log(2)) % 1 == 0)
        && ((Math.log(slots_conjunto)/Math.log(2)) % 1 == 0)
        && ((Math.log(palavras_slot)/Math.log(2)) % 1 == 0)
        ) return true;
    
    else return false;
    
}


function criar_cache(qtd_palavras){

    $("#table").append("<tbody id = 'body-table'></tbody>");
    
    for(var i = 0; i < qtd_palavras; i++)
        $("#body-table").append("<tr><td>"+i+"</td><td>0</td><td>-</td><td>-</td></tr>")


}

/* função para mostrar as informações da cache gerada */
function criar_info(tam_memoria, slots_cache, slots_conjunto, palavras_slot){

    /* quantidade de bits do índice */
    const indice = Math.log2(slots_cache);
    
    /* quantidade de bits do offset */
    const offset = 2 + Math.log2(palavras_slot);

    /* quantidade de bits da tag */
    const tag = Math.log2(tam_memoria) - indice - offset;

    /* quantidade de bits de dados */
    const bits_dados = slots_cache * slots_conjunto * palavras_slot * 32;

    /* quantidade de bits para cache ser implemenada */
    const implementacao = bits_dados + (slots_cache * slots_conjunto) + (slots_cache * slots_conjunto * tag)

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
                        "<td>"+tag+"bits</td>"+
                        "<td>"+indice+"bits</td>"+
                        "<td>"+offset+"bits</td>"+
                    "</tr>"+
                "</tbody>"+
            "</table>"+
            "<h5>A Cache tem "+convert(bits_dados)+" de dados</h5>"+
            "<h5>A Cache precisa de "+convert(implementacao)+" para ser implementada</h5>"+
            "<br>"+
        "</div>";
        

    
    $("#div-table-info").append(string)

}

/* função para verificar quantos Bytes tem a memória principal */
function valida_tam_memoria(tam_memoria){
    
    /* retirando possíveis espaços */
    tam_memoria = tam_memoria.split(" ").join("");
    
    const tipos = ['gb', 'mb', 'kb', 'b'];
    var tam = "";
    var tipo = "";
    
    /* Separando os números das quantidades */
    for(var i = 0; i< tam_memoria.length; i++){
        if(tam_memoria[i] / 1 == tam_memoria[i]) tam += tam_memoria[i];
        else tipo+= tam_memoria[i];
    }

    tipo = tipo.toLowerCase();

    /* verifica se o tamanho é maior que 0 */
    if(tam > 0){

        /* verifica se o tipo informado é aceito */
        if(tipos.indexOf(tipo) != -1){
            
            switch(tipo){

                case "gb":
                    return tam * 1024 * 1024 * 1024;

                case "mb":
                    return tam * 1024 * 1024;

                case "kb":
                    return tam * 1024;
            }

        } else {
            $("#msgs").append("<div id = 'msg' class='uk-alert uk-alert-danger'>Não foi possível criar a Cache, verifique se inseriu valores aceitos.</div>");
            return 0;
        }

    }else{
        $("#msgs").append("<div id = 'msg' class='uk-alert uk-alert-danger'>Não foi possível criar a Cache, verifique se inseriu valores aceitos.</div>");
        return 0;
    }
}

/* função para converter bases */
function convert(num){

    /* transformando em byte */
    num = num/8;

    if(num/1024 >= 1) num = num/1024;
    else return num+" Bytes";

    if(num/1024 >= 1) num = num/1024;
    else return num+ "KB";

    if(num/1024 >= 1) num = num/1024;
    else return num+ "MB";

    if(num/1024 >= 1) num = num/1024;
    else return num+ "GB";
    
}