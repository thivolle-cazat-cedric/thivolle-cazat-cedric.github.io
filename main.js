(function(){
    var cardTpl = '<div class="col-xs-12 col-md-6">' +
      '<div class="card" name="__KIND__-__INDEX__">'+
        '<div class="card-body">'+
          '<h5 class="card-title">'+
            '<input name="__KIND__-__INDEX__" type="number" class="form-control d-inline-block me-4" placeholder=0 min=0>'+
            '<small class="float-end text-muted">__PRICE__€</small>'+
            '<span class="name">__TIITLE__</span>'+
          '</h5>'+
          '<p class="card-text small text-muted"></p>'+
        '</div>'+
      '</div>'+
    '</div>';

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
        $('#menu .card').each( (index, elt) => {
            var num = $(elt).find('input').val()
            var name = $(elt).find('.card-title .name').text().trim()
            if (num > 0){
                order.append(`<li>${num} X ${name}</li>`)
                total_pizza += parseInt(num)
            }
        })
        $('input[name=nbr]').val(total_pizza)
    }

    $(document).on('change', '#menu .card input', refreshPizzas)

    function getDishCard(data, index){
        return cardTpl.
            replaceAll('__TIITLE__', data.title).
            replaceAll('__KIND__', data.kind).
            replaceAll('__INDEX__', data.kind).
            replaceAll('__PRICE__', data.price);
    }
    function loadMenu(){
        $.get('/res/data.json', data => {
            console.log(data)
            data.dishes.forEach((item, index) => {
                $("#menu").append(getDishCard(item, index))

            })
        })
    }

    loadMenu();

})();
