/* TODO */
// Remplacer les listes de volontaires et d'élus par un tableau de card 

var tab_participants = [];
var tab_modeleParticipant = [];

/********* MAIN ***********/
// Mise en place des listener
document.getElementById("btn_tirage").addEventListener("click", lancerTirage);
document.getElementById("btn_ajoutParticipant").addEventListener("click", ajoutParticipant);
document.getElementById("btn_RAZListes").addEventListener("click", RAZListes);
// Recuperation des listes de participants dans le stockage local
tab_participants = JSON.parse(localStorage.getItem("participants") || "[]");
MAJAffichageTab();
/********* FIN MAIN ***********/

/********* FONCTIONS ***********/
// retourne un nombre compris entre 0 et max
function getRandomInt(max) {
  return (Math.floor(Math.random() * Math.floor(max)));
}

// Lance le tirage au sort et retire le nom de la liste des volontaire pour le mettre dans la liste des élus
function lancerTirage() {
  // On fait quelque chose uniquement s'il y a des volontaires
  tabDesNonElimine = tab_participants.filter(participant => participant.estElimine == false);
  if (tabDesNonElimine.length > 0) {
    // Tire un numero au hasard compris entre 0 et le nombre max d'element dans le tableau
    let numElu = (Math.floor(Math.random() * Math.floor(tabDesNonElimine.length)));
    lancerConfetti();
    afficherElu(tabDesNonElimine[numElu].nom);
    tabDesNonElimine[numElu].estElimine = true;
    MAJTabParticipants();
  } else {
    // Affichage d'une sweetAlert
    Swal.fire({
      title: 'Impossible de tirer au sort s\'il n\'y a aucun courageux volontaire!',
      confirmButtonText: 'J\'ai compris mon erreur...',
      animation: false,
      customClass: {
        popup: 'animated lightSpeedIn faster'
      },
      imageUrl: 'ressources/noVolunteer.gif',
      imageWidth: 300,
      imageHeight: 163,
      imageAlt: 'volunteerImage'
    })
  }
}

function MAJAffichageTab() {
  document.getElementById("containerParticipants").innerHTML = '<h1> Tableau des courageux volontaires </h1>';
  tab_participants.forEach(element => {
    document.getElementById("containerParticipants").innerHTML += '<div class="carteParticipant">'
      + '<img class="iconeAvatar" src="' + (element.estElimine == true ? "ressources/eliminated.png" : "ressources/avatarNeutre.png") + '" alt="Avatar" style="width:100%">'
      + '<div class="container">'
      + '  <h1><b>' + element.nom + '</b></h1>'
      + '</div>'
      + '</div>'
  });
}

// MAJ du tableau des participants et de l'affichage de la liste des participants
function MAJTabParticipants() {
  localStorage.setItem("participants", JSON.stringify(tab_participants));
  MAJAffichageTab();
}

async function ajoutParticipant() {
  const { value: nomParticipant } = await Swal.fire({
    title: 'Veuillez indiquer le nom du courageux volontaire',
    input: 'text',
    inputPlaceholder: 'Nom du volontaire',
    imageUrl: 'ressources/volunteer.gif',
    imageWidth: 500,
    imageHeight: 185,
    imageAlt: 'volunteerImage',
    inputValidator: (value) => {
      if (!value) {
        return 'Il semblerait que vous ayez oublié de renseigner le nom du volontaire.'
      }
    }
  })
  if (nomParticipant) {
    tab_participants.push(new Participant(nomParticipant));
    MAJTabParticipants();
  }
}

// Remise a zero des listes
function RAZListes() {
  if (tab_participants == 0) {
    Swal.fire({
      title: 'Les listes des participants est déjà vide!',
      confirmButtonText: 'J\'ai compris mon erreur...',
      animation: false,
      customClass: {
        popup: 'animated lightSpeedIn faster'
      },
      imageUrl: 'ressources/alone.gif',
      imageWidth: 500,
      imageHeight: 228,
      imageAlt: 'aloneImage'
    })
  } else {
    Swal.fire({
      title: 'Voulez vous vraiment remettre à zéro la liste des volontaires?',
      showCancelButton: true,
      imageUrl: 'ressources/areYouSure.gif',
      imageWidth: 220,
      imageHeight: 138,
      imageAlt: 'areYouSureImage',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'En fait non!',
      confirmButtonText: 'Oui je suis sûr!'
    }).then((result) => {
      if (result.value) {
        tab_participants = [];
        localStorage.setItem("participants", JSON.stringify(tab_participants));
        MAJTabParticipants();
        MAJTabElus();
        Swal.fire(
          'La liste a bien été réinitialisée!',
          '',
          'success'
        )
      }
    })
  }
}

// Joue l'animation d'appararition du nom de l'elu
function afficherElu(elu) {
  document.getElementById("letters").textContent = elu;
  var textWrapper = document.querySelector('.nomElu .letters');
  textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, '<span class="letter" style="opacity: 0;">$&</span>');
  var lettre = document.querySelectorAll('.nomElu .letter');
  let i = 0;
  $(lettre[i]).fadeIn({
    duration: 100
  });
  lettre[i].classList.add('animated', 'jackInTheBox', 'slow');
  setTimeout(suiteTraitement, 150)
  function suiteTraitement() {
    i++;
    if (lettre[i]) {
      $(lettre[i]).fadeIn({
        duration: 100
      });
      lettre[i].classList.add('animated', 'jackInTheBox', 'slow');
      setTimeout(suiteTraitement, 150);
    }
  }
}

// On initialise les confettis en fond, sans les afficher.
var confettiSettings = {
  target: 'confettiCanvas',
  max: 500,
  props: ['square', 'triangle', 'line', 'circle'],
  colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
  rotate: true,
  clock: 100
};
var confetti = new ConfettiGenerator(confettiSettings);
confetti.render();

// Affiche les conffetis puis les fais disparaitre
function lancerConfetti() {
  $("#confettiCanvas").fadeIn({
    duration: 1000
    , complete: function () { setTimeout(arreterConfetti, 3000); }
  });

  function arreterConfetti() {
    $("#confettiCanvas").fadeOut(1000);
  }
}
/********* FIN FONCTIONS ***********/