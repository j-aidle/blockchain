pragma solidity ^0.5.0;

contract Historic {
    uint idMatricula;
    struct estudiant {
        uint id;
        string nom;
        string cognom;
        uint edat;
    }

    struct assignatura {
        uint id;
        string nom;
        uint curs;
        uint nota;
    }

    assignatura[] assignatures;
    string data;
    
    function newEstudiant(){
    
    }
    
    
    
}
