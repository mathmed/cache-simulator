

/* função para gerar tabela cache */
$(document).ready(function(){

    /*  função que é chamada quando o botão "Gerar cache é clicado" */
    $("#gerar-cache").click(function(){

        $("#msg").remove();
        $("#table-info").remove();  
        $("#body-table").remove();
        $("#rate").addClass("off");
        $("#enderecos").addClass("off");
        $("#table").append("<tbody id = 'body-table'></tbody>");

        /* Zerando as taxas */
        document.getElementById("miss").innerHTML="0";
        document.getElementById("hit").innerHTML="0";
        document.getElementById("hit-rate").innerHTML="-";
        
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

        /* verificando o tanto de hits forçados que haverá */
        var hits_forcados = Math.floor(Math.random() * 20);
        var repeticoes = 0;

        /* criando as instruções */
        for(var i = 0; i < 20; i++){
            
            instrucao = dec2hex((Math.floor(Math.random() * tam_mem-1))); 
            instrucoes += instrucao;

            /* verifica se é a primeira instrução adicionada */
            if(i == 0){
                $('#instrucao-atual').val(instrucao);
                instrucoes = "";
            }

            if(repeticoes < hits_forcados && i != 0){
                instrucoes += "," + instrucao + "," + instrucao + "," + instrucao + "," + instrucao + "," + instrucao;
                repeticoes+=1;
            }


            if(i != 0)
                instrucoes += ",";        
            instrucao = ""; 
        }

        /* removendo a última e a primeira vírgula */
        instrucoes = instrucoes.substring(',', instrucoes.length - 1)
        instrucoes = instrucoes.split(",")

        /* randomizando as instruções */
        for (var i = instrucoes.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = instrucoes[i];
            instrucoes[i] = instrucoes[j];
            instrucoes[j] = temp;
        }
        
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

/* função para criar graficamente a tabela cache */
function criar_cache(mapeamento){

    /* verificando qual o tipo de mapeamento */
    
    /* caso totalmente associativo */
    if(mapeamento[0] == "T")
        $("#info-enderecos").append("<div id = 'msg' class='uk-alert uk-alert-warning'>A cache é totalmente associativa, não é possível haver colisões.</div>");
    
    /* no caso de um mapeamento direto */
    else{
        /* chamando função que cria a interface de inserção de instruções */
        $("#enderecos").removeClass("off");
        $("#rate").removeClass("off");
    }
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

/* funções para converter tipo de dados, MB, KB, GB, B */
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

    /* se não preencher com os 0's faltantes */
    else{

        instrucao = String(instrucao);

        const faltante = tam_instrucao - instrucao.length;
        var add = "";

        for(var i = 0; i < faltante; i ++) add += "0";

        return add+instrucao;
    }

}

/* função para gerar a tabela de endereçamento após a submissão de um endereço */
function config_table(instrucao){

    /* removendo mensagem de HIT/MISS */
    $("#msg-miss-hit").remove();

    /* recuperando a quantidade de bits necessários para cada campo */
    const tag = $("#tag").val();
    const offset = $("#offset").val();

    /* formatando */
    const tag_table = instrucao.substring(0, tag)
    const tag_indice = instrucao.substring(tag, instrucao.length-offset);
    const n_indice = bin2dec(parseInt(tag_indice));

    /* variáveis auxiliares */
    var table = $('#body-table');
    var existe = false;
    var index_existe = false;
    var qtd_slots_usados = 0;
    var mensagem = "";
    var enderecamento = "";

    /* verifica qual o tipo de endereçamento */
    if($("#slots-conjunto").val() == 1)
        enderecamento = "direto";
    else enderecamento = "associativo";


    /* Laço para verificar se existe o endereço enviado na Cache */
    table.find('tr').each(function(){

        /* removendo mensagens de erro/sucesso */
        $(this).removeClass("miss");
        $(this).removeClass("hit");

        /* recuperando as informações da linha */
        var indice = ($(this).find(".indice").attr("indice"));
        var tag = ($(this).find(".tag").attr("tag"));
        var validade = ($(this).find(".validade").attr("validade"));

        /* verifica se dá um hit */
        if(indice == tag_indice && tag == tag_table && validade == 1){

            $(this).addClass("hit");
            existe = true;

            /* adicionando mensagem */
            mensagem = "<div id = 'msg-miss-hit' class='uk-alert uk-alert-success'>HIT! O endereço foi encontrado na Cache no indice "+indice+". </div>"
            
        }
        
        if(indice == tag_indice){

            /* aumentando o contador de slots em uso daquele indice */
            qtd_slots_usados++;

            index_existe = indice;
        }
            
    });
    
    /* Apagando a instrução atual do input */
    $("#instrucao-atual").val("");

    /* pegando a próxima instrução do input */
    const prox_instrucao = $("#prox-instrucoes").val().split(",")[0];

    /* guardando as demais instruções no input*/
    const outras_instrucoes = $("#prox-instrucoes").val().split(/,(.+)/)[1];

    /* guardando nos inputs */
    $("#instrucao-atual").val(prox_instrucao);
    $("#prox-instrucoes").val(outras_instrucoes);

    /* Caso o endereço não existe, adicioná-lo na cache */
    if(!existe){

        /* Caso o index inviado já exista, verifica o tipo de endereçamento */
        if(index_existe){
            
            if(enderecamento == "direto"){

                /* Se o endereçamento for direto, irá substituir a instrução pela nova */
                $("#"+index_existe).remove();
                /* Criando mensagem que aparecerá na tela */
                mensagem = "<div id = 'msg-miss-hit' class='uk-alert uk-alert-danger'>MISS! O índice "+index_existe+" está ocupado com uma TAG diferente, a nova TAG foi carregada. </div>"
            }

            /* caso de endereçamento associativo */
            else{

                /* verifica se a quantidade de slots usados para esse indice é maior que o permitido */
                if(qtd_slots_usados >= $("#slots-conjunto").val()){

                    /* caso seja maior, é necessário atualizar algum dos slots, nesse caso o primeiro verificado é atualizado */
                    $("#"+index_existe).remove();

                    /* Criando mensagem que aparecerá na tela */
                    mensagem = "<div id = 'msg-miss-hit' class='uk-alert uk-alert-danger'>MISS! Os slots do índice "+index_existe+" estãos ocupados mas com TAGs diferentes, a nova TAG foi carregada fazendo uma substituição. </div>"
                
                }else{
                    mensagem = "<div id = 'msg-miss-hit' class='uk-alert uk-alert-danger'>MISS! Existem slots vázios no indice "+index_existe+", o endereço será carregado em um dos slots </div>"
                }
            }
            
        }else{
            /* Criando mensagem que aparecerá na tela */
            mensagem = "<div id = 'msg-miss-hit' class='uk-alert uk-alert-danger'>MISS! o índice está sem instruções, a instrução atual será carregada nele.</div>"
        }
        

        /* Linha que será inserida */
        const string = 
            "<tr class = 'miss' id = '"+tag_indice+"'>"+
                "<td class = 'indice' indice_n = '"+n_indice+"' indice = '"+tag_indice+"'>"+"("+n_indice+") "+tag_indice+"</td>"+
                "<td class = 'validade' validade = '1'>1</td>"+
                "<td class = 'tag' tag = '"+tag_table+"'>"+tag_table+"</td>"+
                "<td>"+$("#palavras-slot").val() + " palavra(s)" +"</td>"+
            "</tr>";
        

        /* variáveis auxiliares */
        var atual = "";
        var primeiro = "";
        var cont = 0;

        /* verificando a posição da tabela em que será inserido */
        table.find('tr').each(function(){

            if(cont == 0) primeiro = $(this);

            if($(this).find(".indice").attr("indice") < tag_indice )
                atual = $(this);
            
            cont+=1;

        })

        if(!atual && !primeiro)
            $("#body-table").append(string);

        else{
            if(atual)
                $(string).insertAfter(atual);
            else
                $(string).insertBefore(primeiro);
        }

        /* Aumentando o miss */
        document.getElementById("miss").innerHTML= parseInt($("#miss").text())+1;
    
    }else{
        /* Aumentando o hit */
        document.getElementById("hit").innerHTML= parseInt($("#hit").text())+1;
    }

    /* atualizando a porcentagem */
    const total = parseInt($("#hit").text()) + parseInt($("#miss").text());
    document.getElementById("hit-rate").innerHTML= (parseInt($("#hit").text())/total * 100).toFixed(2) + "%"
    
    /* Adicionando mensagem do que ocorreu */
    $("#div-msg-miss-hit").append(mensagem)
}

/* função para validar uma instrução */
function valida_instrucao(instrucao){

    /* recuperando o tamanho da memória */
    const tam_mem = $("#tam-memoria-hidden").val();
    
    /* verificando se a instrução é vazia */
    if(instrucao != ""){

        /* convertendo a instrução de hexa para decimal */
        instrucao = hex2dec(instrucao);
        
        /* verifica se está dentro do permitido (menor que o tamanho da memoria) */
        if(parseInt(instrucao) <= parseInt(tam_mem)) return true;

        else return false;

    }else return false;
}