

/* função para gerar tabela cache */
$(document).ready(function(){
    

    /*  função que é chamada quando o botão "Gerar cache é clicado" */
    $("#gerar-cache").click(function(){

        $("#msg").remove();
        $("#table-info").remove();  
        $("#body-table").remove();
        $("#table").append("<tbody id = 'body-table'></tbody>");
        
        /* guardando os parâmetros enviados */
        var tam_memoria = $("#tam-memoria").val();
        var slots_cache = $("#slots-cache").val();
        const slots_conjunto = $("#slots-conjunto").val();
        const palavras_slot = $("#palavras-slot").val();

        /* função para validar tamanho da memória */
        tam_memoria = valida_tam_memoria(tam_memoria);

        /* função para validar slots da cache */
        slots_cache = valida_slots_cache(slots_cache);

        if(tam_memoria > 0 && slots_cache > 0){

            /* verifica se os campos informados são potências de 2 */
            if(verifica_potencia(slots_conjunto, palavras_slot)){

                /* criando informações sobre a cache */
                mapeamento = criar_info(tam_memoria, slots_cache, slots_conjunto, palavras_slot);

                /* criando a tela para informar endereços */
                criar_cache(mapeamento);

            }else
                $("#msgs").append("<div id = 'msg' class='uk-alert uk-alert-danger'>Não foi possível criar a Cache, verifique se inseriu valores aceitos.</div>");
            
        }
    })

    /* função para gerar instruções aleatóriamente */
    $("#gerar-instrucoes").click(function(){

        /* verificando tamanho da memória para tamanho das instruções */
        const tam_mem = $("#tam-memoria-hidden").val();
        
        var instrucoes = "";
        var instrucao = "";

        /* criando as instruções */
        for(var i = 0; i < 10; i++){
            
            instrucao = dec2hex((Math.floor(Math.random() * tam_mem-1))); 
            instrucoes += instrucao;

            /* verifica se é a primeira instrução adicionada */
            if(i == 0){
                $('#instrucao-atual').val(instrucao);
                instrucoes = "";
            }

            if(i != 0)
                instrucoes += ",";        
            instrucao = ""; 
        }
        
        /* removendo a última e a primeira vírgula */
        instrucoes = instrucoes.substring(',', instrucoes.length - 1)

        $('#prox-instrucoes').val(instrucoes);

    })

    /* função para gerar os hits e os misses */
    $("#submeter").click(function(){
        
        /* pegando a instrução atual */
        var instrucao = $("#instrucao-atual").val();

        /* verifica se a instrução é valida */
        if(valida_instrucao(instrucao)){
        
            /* transformando em binario */
            instrucao = hex2bin(instrucao).toString();

            /* adicionando 0 se precisar */
            instrucao = add0(instrucao);

            /* função para gerar tabela */
            config_table(instrucao);

        }else{
            alert("Instrução inválida");
        }
        

    })
})

/* função para verificar se os campos informados são potência de 2 */
function verifica_potencia(slots_conjunto, palavras_slot){
    if(
        ((Math.log(slots_conjunto)/Math.log(2)) % 1 == 0)
        && ((Math.log(palavras_slot)/Math.log(2)) % 1 == 0)
        ) return true;
    
    else return false;
    
}

function criar_cache(mapeamento){

    /* verificando qual o tipo de mapeamento */
    
    /* caso totalmente associativo */
    if(mapeamento[0] == "T")
        $("#info-enderecos").append("<div id = 'msg' class='uk-alert uk-alert-warning'>A cache é totalmente associativa, não é possível haver colisões.</div>");
    
    /* no caso de um mapeamento direto */
    else
        /* chamando função que cria a interface de inserção de instruções */
        $("#enderecos").removeClass("off");

}

/* função para mostrar as informações da cache gerada */
function criar_info(tam_memoria, slots_cache, slots_conjunto, palavras_slot){

    /* quantidade de bits do índice */
    const indice = Math.log2(slots_cache/slots_conjunto);
    
    /* quantidade de bits do offset */
    const offset = 2 + Math.log2(palavras_slot);

    /* quantidade de bits da tag */
    const tag = Math.log2(tam_memoria) - indice - offset;

    /* quantidade de bits de dados */
    const bits_dados = slots_cache * slots_conjunto * palavras_slot * 32;

    /* quantidade de bits para cache ser implemenada */
    const implementacao = bits_dados + (slots_cache * slots_conjunto) + (slots_cache * slots_conjunto * tag)

    /* verifica qual o tipo de mapeamento */
    var mapeamento;
    if(indice == 0) mapeamento = "Totalmente Associativo";
    else if(slots_conjunto == 1) mapeamento = "Direto";
    else mapeamento = "Mapeamento associativo por conjuntos, "+ slots_conjunto + " vias";

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
            "<h5>O mapeamento utilizado é "+mapeamento+"</h5>"+
            "<h5>A Cache tem "+convert(bits_dados)+" de dados</h5>"+
            "<h5>A Cache precisa de "+convert(implementacao)+" para ser implementada</h5>"+
            "<br>"+
        "</div>";

        /* adicinando valores nos inputs escondidos */
        $("#tag").val(tag);
        $("#indice").val(indice);
        $("#offset").val(offset);
        

    
    $("#div-table-info").append(string)
    return mapeamento;

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
                    $("#tam-memoria-hidden").val(tam * 1024 * 1024 * 1024)
                    return tam * 1024 * 1024 * 1024;

                case "mb":
                    $("#tam-memoria-hidden").val(tam * 1024 * 1024)
                    return tam * 1024 * 1024;

                case "kb":
                    $("#tam-memoria-hidden").val(tam * 1024)
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

/* Função para validar a quantidade de slots de memória informado */
function valida_slots_cache(slots_cache){

    /* retirando possíveis espaços */
    slots_cache = slots_cache.split(" ").join("");

    var tam = "";
    var tipo = "";
    
    /* Separando os números das quantidades */
    for(var i = 0; i< slots_cache.length; i++)
        if(slots_cache[i] / 1 == slots_cache[i]) tam += slots_cache[i];
        else tipo+= slots_cache[i];

    tipo = tipo.toLowerCase();

    /* verifica se o tamanho é maior que 0 */
    if(tam > 0){

        /* verifica se o tipo informado é aceito */
        if(tipo == "k")
            return tam*1024;

        else if (tipo == "")
            if(Math.log(tam)/Math.log(2) % 1 == 0){
                return tam;
            }else{
                $("#msgs").append("<div id = 'msg' class='uk-alert uk-alert-danger'>Não foi possível criar a Cache, verifique se inseriu valores aceitos.</div>");
                return 0;
            }
        
         else {
            $("#msgs").append("<div id = 'msg' class='uk-alert uk-alert-danger'>Não foi possível criar a Cache, verifique se inseriu valores aceitos.</div>");
            return 0;
        }

    }else{
        $("#msgs").append("<div id = 'msg' class='uk-alert uk-alert-danger'>Não foi possível criar a Cache, verifique se inseriu valores aceitos.</div>");
        return 0;
    }
}

/* funções para converter bases */
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

const convertBin = (baseFrom, baseTo) => number => parseInt(number, baseFrom).toString(baseTo);

const hex2bin = convertBin(16, 2);
const bin2dec = convertBin(2, 10);
const dec2hex = convertBin(10, 16);
const hex2dec = convertBin(16, 10)


/* função para preencher os 0's falantes em um conjunto de bits */
function add0(instrucao){
    
    /* verificando tamanho da memória para tamanho das instruções */
    const tam_mem = valida_tam_memoria($("#tam-memoria").val());
    var tam_instrucao = Math.ceil(Math.log2(tam_mem));

    /* caso a instrução já esteja no tamanho correto */
    if(instrucao.length == tam_instrucao) return instrucao;

    else{

        instrucao = String(instrucao);

        const faltante = tam_instrucao - instrucao.length;
        var add = "";

        for(var i = 0; i < faltante; i ++)
            add += "0";

        return add+instrucao;
    }

}

/* função para verificar os miss e hits */
function config_table(instrucao){

    /* recuperando a quantidade de bits necessários para cada campo */
    const tag = $("#tag").val();
    const offset = $("#offset").val();

    const tag_table = instrucao.substring(0, tag)
    const tag_indice = instrucao.substring(tag, instrucao.length-offset);
    const n_indice = bin2dec(parseInt(tag_indice)); 

    /* Apagando a instrução atual */
    $("#instrucao-atual").val("");

    /* pegando a próxima instrução */
    const prox_instrucao = $("#prox-instrucoes").val().split(",")[0];

    /* guardando as demais instruções */
    const outras_instrucoes = $("#prox-instrucoes").val().split(/,(.+)/)[1];

    /* guardando nos inputs */
    $("#instrucao-atual").val(prox_instrucao);
    $("#prox-instrucoes").val(outras_instrucoes);

    const string = 
        "<tr>"+
            "<td>"+"("+n_indice+") "+tag_indice+"</td>"+
            "<td>1</td>"+
            "<td>"+tag_table+"</td>"+
            "<td>"+$("#palavras-slot").val() + " palavra(s)" +"</td>"+
        "</tr>";
    
    $("#body-table").append(string);


}

/* função para validar uma instrução */
function valida_instrucao(instrucao){

    /* recuperando o tamanho da memória */
    const tam_mem = $("#tam-memoria-hidden").val();
    

    if(instrucao != ""){

        /* recebendo a instrução em decimal */
        instrucao = hex2dec(instrucao);

        console.log(instrucao)

        console.log(tam_mem)

        /* verifica se está dentro do permitido  */
        if(parseInt(instrucao) <= parseInt(tam_mem))
            return true

        else return false

    }else return false;
}