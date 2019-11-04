class Participant {

    constructor(nom) {
        this.nom = nom;
        this.estElimine = false;
    }

    getNom() {
        return this.nom;
    }

    getEstElimine() {
        return this.estElimine;
    }

    setEstElimine(estElimine) {
        this.estElimine = estElimine;
    }
}