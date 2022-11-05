(function(){
    console.log("couou")
    var inputsChanged = {};
    var total_pizza = 0

    var resOrg = $("#result").html()
    function generateLink(args){
        text= "https://wa.me/33666951941?text="
        text += `Bonjour, Je suis "${args.name} ${args.firstname}"\n`;
        if(!total_pizza){
                text += `je souhaiterai vous reserver une table pour ${args.nbr} le ${args.datetime}.`
        } else {
            text += `je souhaiterais vous commander ${total_pizza} pizza pour ${args.datetime}\n`
            text += $("#order").html().split('</li>').join('\n').replaceAll('<li>', '- ').trim()

        }
        if (args.info.length > 0){
            text += `\n-- info supplémentaire --\n${args.info}`
        }
        text += "\n JE vous remercie de me confirmer la"
        if(!total_pizza){
            text += "réservation."
        } else {
            text += "commande."
        }
        return encodeURI(text)
    }

    function generateImg(args){
        var imgUri = "/res/imgs/WhatsAppButtonGreen.svg"
        return `<a aria-label="Chat on WhatsApp" href="${generateLink(args)}">`+
        `<img alt="Chat on WhatsApp" src="${imgUri}" /></a>`;
    }


    function validateInputText(value, fieldname){
        var errField;
        if(fieldname == "datetime") {
            errField = value < new Date()
        } else {
            errField = ! value || value.length < 2
        }
        if (errField) {
            if ( inputsChanged[fieldname]){
                $(`input[name='${fieldname}']`).addClass('is-invalid')
                return false;
            }
        } else {
            $(`input[name='${fieldname}']`).removeClass('is-invalid')
        }
        return true
    }

    function validateOrder() {
        return total_pizza >= 1

    }

    function validateFrom(args, field, submit){
        var name = null;
        if (field){
            name = field.attr('name')
            inputsChanged[name] = true;
        }
        var valid = true;
        valid &= validateInputText(args['name'], 'name');
        valid &= validateInputText(args['firstname'], 'firstname');
        valid &= validateInputText(args['datetime'], 'datetime');
        if ($("form").attr('name') == "order"){
            valid &= validateOrder();
        }
        if (valid && args.accept == "on"){
            $('#result').html(generateImg(args))
        } else {
            $('#result').html(resOrg)

        }
    }

    function getFormData(){
        var values = {};
        $("form").serializeArray().forEach(attr => values[attr.name] = attr.value);
        if (values.datetime) {
            values.datetime = new Date(values.datetime)
        }
        return values;
    }

    $( "form input[type='text']").blur(elt => validateFrom(getFormData(), $(elt.target)))
    $( "form input[name='datetime']").blur(elt => validateFrom(getFormData(), $(elt.target)))
    $( "form input[type='checkbox']").on('change', elt => validateFrom(getFormData(), $(elt.target)))
    $( "form" ).submit(function( event ) {
        event.preventDefault();
        canOpenWhatsapp();
        return false
    });

    function canOpenWhatsapp(){
        var values = getFormData()
        if (!validateFrom(values)){return false}
        $('#result').html(generateImg(values))
    }

    // order

    function refreshPizzas(){

        var order = $("ul#order");
        order.html('');
        total_pizza = 0
        console.log('coucou', order)
        $('#menu .card').each( (index, elt) => {
            var num = $(elt).find('input').val()
            var name = $(elt).find('.card-title').text().trim()
            if (num > 0){
                order.append(`<li>${num} X ${name}</li>`)
                total_pizza += parseInt(num)
            }
        })
        $('input[name=nbr]').val(total_pizza)
        console.log(total_pizza, getFormData(), canOpenWhatsapp())
    }

    $("#menu .card input").change(refreshPizzas)

})();
