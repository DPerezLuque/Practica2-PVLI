var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}


battle.setup({
    heroes: {
        members: [
            RPG.entities.characters.heroTank,
            RPG.entities.characters.heroWizard
        ],
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        members: [
            RPG.entities.characters.monsterSlime,
            RPG.entities.characters.monsterBat,
            RPG.entities.characters.monsterSkeleton,
            RPG.entities.characters.monsterBat
        ]
    }
});

battle.on('start', function (data) {
    console.log('START', data);
});

battle.on('turn', function (data) {
    console.log('TURN', data);

    // TODO: render the characters
    

        //Guarda los ID, mediante el metodo Object.keys, en una lista
        var list = Object.keys (this._charactersById); 
        //Listas de personajes, los enemigos y los aliados
        var chara = document.querySelectorAll ('.character-list');
        //Variable de un personaje independiente
        var li; 
        //El render, lo que se escribe en el html de forma dinámica para que se pinte.
        var render;
        
        //Para evitar que se escriba de forma descontrolada.
        chara[0].innerHTML = chara[1].innerHTML = "";


    //ID en la lista de id´s
    for (var i in list) {
        
        li = this._charactersById[list[i]];

        //Rellenamos en html con los datos de personaje, con la estructura que debería tener.
        //Cuando el personaje está muerto, se le añade la clase "dead"
        if (li.hp <= 0){
            render = '<li data-chara-id="' + list[i] + '"class = "dead"' +  '">' + li.name + '(HP: <strong>' + li.hp
            + '</strong>/' + li.maxHp + ', MP: <strong>' + li.mp + '</strong>/' + li.maxMp +') </li>';
        }

        else  render = '<li data-chara-id="' + list[i] +  '">' + li.name + '(HP: <strong>' + li.hp
            + '</strong>/' + li.maxHp + ', MP: <strong>' + li.mp + '</strong>/' + li.maxMp +') </li>';
       
      
      //Coprobamos si es aliado o enemigo para ponerlo en una columna u otra.
      //Izquierda para los heroes, derecha para los enemigos
        if (li.party === 'heroes'){

            chara[0].innerHTML += render;
        }

        else{

            chara[1].innerHTML += render;
        }
    }  

    // TODO: highlight current character
      //Variable del personaje que se va a seleccionar. Esta var guarda el ID del personaje activo( el que va a ejecutar acción)
    var selectChar = document.querySelector('[data-chara-id= "' + data.activeCharacterId + '"]');
    //Al personaje activo, se le añade el atributo 'activo' para modificar su color, desde el CSS
    selectChar.classList.add('active');


    // TO DO: show battle actions form

    //Primero, ponemos el display de actionForm a 'inline' para que se vea.

    actionForm.style.display = 'inline';

    //Esta var recoge el grupo de opciones que existen actualmente, los toma de optionsStack.
      var OpcionesBatalla = this.options.current._group;
     
    //Esta var toma la lista de opciones de la clase 'choices' que existe en HTML y se guarda
      var accionesBatalla = actionForm.querySelector('.choices');

    //Se pone la primera a vacio para evitar que se rellene constantemente
      accionesBatalla.innerHTML = "";

    for (var i in OpcionesBatalla){  

      render =  '<li><label><input type="radio" name="option" value="' + i + 
                    '"required>' + i + '</label></li>';
 
       accionesBatalla.innerHTML += render;
    }

    //Los targets disponibles (todas las entidades), cuando uno de los forms lo invoquen
   // target.style.display = 'none';
    //Lista de targets
    var opcionTarget = this._charactersById; 
    //Las opciones de targets que hay
    var activeTarget = targetForm.querySelector('.choices');
    activeTarget.innerHTML = "";

    for (var i in opcionTarget){
        if (opcionTarget[i].hp > 0) {

          render = '<li><label class="heroes"><input type="radio" name="target" value="' + i + 
                            '"required>' + i + '</label></li>';

          activeTarget.innerHTML += render;
        }
    }


    //   HECHIZOS 
    spellForm.style.display = 'none';
    //Todos los hechizos
    var optionSpell = this._grimoires[this._activeCharacter.party];
    //console.log (optionSpell);
    //Opcion activa
    var activeSpell = spellForm.querySelector('.choices');
    activeSpell.innerHTML = "";

    for (var i in optionSpell){

       if (this._charactersById[data.activeCharacterId].mp >= optionSpell[i].cost) {
          render = render = '<li><label><input type="radio" name="spell" value="' + i +
           '"required>' + i + '</label></li>';

            activeSpell.innerHTML += render;
      }
    }
    //Declaramos el botón, para activarlo o desactivarlo en funcion del mp.
    var boton = spellForm.querySelector('button');
    if (this._charactersById[data.activeCharacterId].mp <= 10){
        boton.disabled = true;
    } 
    else boton.disabled = false;
});

battle.on('info', function (data) {
    console.log('INFO', data);
    // TODO: display turn info in the #battle-info panel
    //Inicializamos la fuente del efecto, que varía acorde a la acción ejecutada.
    var efectoText = prettifyEffect (data.effect || {});

    //Distintos casos para la batalla, redactado en inglés para más facilidad de lectura
    //Con la misma sintaxis que los "console.log"
    if(data.action === 'attack' && data.success)
       infoPanel.innerHTML = '<strong>'+data.activeCharacterId+'</strong>'+ " "+ data.action+"ed"+ " " +  '<strong>'+ data.targetId+ '</strong>' 
                                    + "  and caused " + efectoText + "."  ;

    else if(data.action === 'attack' && !data.success)
        infoPanel.innerHTML = '<strong>' + data.activeCharacterId + '</strong>' + " has failed.";

    else if(data.action === 'defend' && data.success)
        infoPanel.innerHTML = '<strong>'+ data.activeCharacterId +'</strong>' + " " +data.action+ "ed, new defense is "+data.newDefense+".";

    else if(data.action === 'defend' && !data.success)
        infoPanel.innerHTML = '<strong>'+data.activeCharacterId+'</strong>' + " has failed.";

    else if(data.action === 'cast' && data.success)
       infoPanel.innerHTML = '<strong>' +data.activeCharacterId+'</strong>' + " " + data.action + "ed" + " " + data.scrollName + 
                                    " on " +'<strong>' + data.targetId + '</strong>' + " and caused " + efectoText + ".";
    else if(data.action === 'cast' && !data.success)
        infoPanel.innerHTML = '<strong>' + data.activeCharacterId + '</strong>' + " has failed.";
});

battle.on('end', function (data) {
    console.log('END', data);

    // TODO: re-render the parties so the death of the last character gets reflected
    // TODO: display 'end of battle' message, showing who won
    

        //Guarda los ID, mediante el metodo Object.keys, en una lista
        var list = Object.keys (this._charactersById); 
        //Listas de personajes, los enemigos y los aliados
        var chara = document.querySelectorAll ('.character-list');
        //Variable de un personaje independiente
        var li; 
        //El render, lo que se escribe en el html de forma dinámica para que se pinte.
        var render;
        
        //Para evitar que se escriba de forma descontrolada.
        chara[0].innerHTML = chara[1].innerHTML = "";


    //ID en la lista de id´s
    for (var i in list) {
        
        li = this._charactersById[list[i]];

        //Rellenamos en html con los datos de personaje, con la estructura que debería tener.
        //Cuando el personaje está muerto, se le añade la clase "dead"
        if (li.hp <= 0){
            render = '<li data-chara-id="' + list[i] + '"class = "dead"' +  '">' + li.name + '(HP: <strong>' + li.hp
            + '</strong>/' + li.maxHp + ', MP: <strong>' + li.mp + '</strong>/' + li.maxMp +') </li>';
        }

        else  render = '<li data-chara-id="' + list[i] +  '">' + li.name + '(HP: <strong>' + li.hp
            + '</strong>/' + li.maxHp + ', MP: <strong>' + li.mp + '</strong>/' + li.maxMp +') </li>';
       
      
      //Coprobamos si es aliado o enemigo para ponerlo en una columna u otra.
      //Izquierda para los heroes, derecha para los enemigos
        if (li.party === 'heroes'){

            chara[0].innerHTML += render;
        }

        else{

            chara[1].innerHTML += render;
        }
    }  

    // Texto final del juego, que lanza al ganador
     infoPanel.innerHTML = 'The winners are: <strong>'  + data.winner + '</strong>';
});

window.onload = function () {
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');

    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
         // TO DO: select the action chosen by the player
                        //name = "option" de la lista
         var action = actionForm.elements['option'].value;
         battle.options.select(action);
         
       
        // TODO: hide this menu
        // TO DO: go to either select target menu, or to the select spell menu
        if (action === 'attack'){
            actionForm.style.display = 'none'; // oculta el formulario de acciones
            targetForm.style.display = 'block'; // muestra el formulario de objetivos
        }

        else if (action === 'cast'){
            actionForm.style.display = 'none'; //Oculta la acciones
            spellForm.style.display = 'block'; //Llama al formulario de hechizos
        }
       
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TO DO: select the target chosen by the player
        var target = targetForm.elements['target'].value;
        battle.options.select (target);
            //hides this menu
        targetForm.style.display = 'none'; // oculta objetivos, una vez seleccionado
        actionForm.style.display = 'block'; // muestra las acciones

       
       
    });
        //Este método añade la option de cancelar, y espera a un click
        //para bloquear la acción
    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();
       
        // TODO: hide this form
        // TODO: go to select action menu
        targetForm.style.display = 'none'; //Ocultamos target, ya que se ha cancelado
        actionForm.style.display = 'block'; //vuelve a las acciones
    });



    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        // TODO: select the spell chosen by the player
        var spell = spellForm.elements['spell'].value;
        battle.options.select (spell);
        
        // TODO: hide this menu
        spellForm.style.display = 'none'; // oculta objetivos, una vez seleccionado

        // TODO: go to select target menu
        //Vamos al menú de selección del target, una vez ahí le pasamos la seleccion deseada
        //al Form y volvemos a las opciones

        targetForm.style.display = 'block';
        battle.options.select (target); //Llamamos al target del hechizo
        targetForm.style.display = 'none';
        actionForm.style.display = 'block'; // muestra las acciones
    });




    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();

        // TODO: hide this form
        // TODO: go to select action menu
        spellForm.style.display = 'none';//Ocultamos los spells
        actionForm.style.display = 'block' ;//Vuelve a las acciones
    });

    battle.start();
};
