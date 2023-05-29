pragma solidity >0.8.0;

contract HistoryRecord {

  uint public countSubject=0;
  uint public countGrades=0;
  uint public countProfessors=0;
  uint public countUsers=0;
  uint public countStudentSubjects=0;

  Subject[] subjects;
  address[] professorsList;
  address[] usersList;

     
  struct Admin {
      address id;
  }
  
  struct User {
      address id;
      string name;
  }

  struct Professor {
    address id;
    string name;
  }

  struct Subject {
    uint id;
    string name;
  }

  struct Grades {
    //uint id;
    uint studentSubjectsId;
    string description;
    uint value;
    uint256 momentAddition;
  }

  struct ProfessorsSubjects {
    //uint id;
    address professorId;
    uint subjectId;
  }
  struct StudentsSubjects {
    uint id;
    address studentId;
    address professorId;
    uint subjectId;
  }

  
  
  mapping (address => Admin) public admins;
  mapping (address => User) public users;
  mapping (address => Professor) public professors;
  //mapping (uint => Grades) public grades;
  Grades[] grades;
  ProfessorsSubjects[] professorsSubjects;
  StudentsSubjects[] studentsSubjects;

  // events

  event AdminAdded(address adminId);
  event UserAdded(address userId);
  event ProfessorAdded(address professorId);
  event RecordAdded(string subjectName, uint subjectValue, address userId, address adminId); 
  event SubjectAdded(string nameSubject);
  event ProfessorSubjectsAdded(address _professorId,uint _subjectId);
  event ProfessorSubjectsDeleted(address _professorId,uint _subjectId);
  event StudentSubjectsAdded(address _studentId,address _professorId,uint _subjectId);
  event StudentSubjectsDeleted(uint _id);
  event GradeAdded(uint _studentSubjectsId, string _description, uint _value);
  
  // modifiers

  modifier userExists(address userId) {
    require(users[userId].id == userId, "User does not exist");
    _;
  }

  modifier senderIsAdmin {
    require(admins[msg.sender].id == msg.sender, "Sender is not an admin");
    _;
  }
  
  // functions
  function addGrade(uint _studentSubjectsId, string memory _description, uint _value) public {
    grades.push(Grades(_studentSubjectsId,_description,_value,block.timestamp));
    emit GradeAdded(_studentSubjectsId, _description, _value);
  }

  function getGrades() public view returns(Grades[] memory) {
    return grades;
  }

  function addStudentSubjects(address _studentId, address _professorId, uint _subjectId) public {
    studentsSubjects.push(StudentsSubjects(countStudentSubjects,_studentId,_professorId,_subjectId));
    countStudentSubjects++;
    emit StudentSubjectsAdded(_studentId,_professorId,_subjectId);
  }

  function deleteStudentSubjects(uint _id) public {
    /*for (uint i = 0; i < studentsSubjects.length; i++) {
      if(studentsSubjects[i].id == _id){
        studentsSubjects[i] = studentsSubjects[studentsSubjects.length -1];
      }
    }*/
    for (uint i = _id; i < studentsSubjects.length-1; i++) {
        studentsSubjects[i] = studentsSubjects[i+1];
    }
    studentsSubjects.pop();
    emit StudentSubjectsDeleted(_id);
  }

  function getStudentSubjects() public view returns(StudentsSubjects[] memory) {
    return studentsSubjects;
  }

  function addProfessorSubjects(address _professorId, uint _subjectId) public {
    professorsSubjects.push(ProfessorsSubjects(_professorId,_subjectId));
    emit ProfessorSubjectsAdded(_professorId,_subjectId);
  }

  function deleteProfessorSubjects(address _professorId, uint _subjectId) public {
    /*for (uint i =0; i < professorsSubjects.length; i++) {
      if(professorsSubjects[i].professorId == _professorId && professorsSubjects[i].subjectId == _subjectId) {
        professorsSubjects[i] = professorsSubjects[professorsSubjects.length -1];
      }
    }*/
    uint found=0; 
    for (uint i =0; i < professorsSubjects.length; i++) {
      if(professorsSubjects[i].professorId == _professorId && professorsSubjects[i].subjectId == _subjectId) {
        found = i;
      }
    }
    for (uint i =found; i < professorsSubjects.length-1; i++) {
        professorsSubjects[i] = professorsSubjects[i+ 1];
    }
    professorsSubjects.pop();
    emit ProfessorSubjectsDeleted(_professorId,_subjectId);
  }

  function getProfessorSubjects() public view returns(ProfessorsSubjects[] memory) {
    return professorsSubjects;
  }

  function addAdmin() public {
    require(admins[msg.sender].id != msg.sender, "This admin already exists.");
    admins[msg.sender].id = msg.sender;

    emit AdminAdded(msg.sender);
  }

  function addUser(address _userId, string memory _nameUser) public senderIsAdmin {
    if(!duplicatedUser(_userId)){
      require(users[_userId].id != _userId, "This user already exists.");
      users[_userId].id = _userId;
      users[_userId].name = _nameUser;
      usersList.push(_userId);
      countUsers++;
      emit UserAdded(_userId);
    }
  }
  
  function getUsers() public view returns(User[] memory) {
    User[] memory us = new User[](countUsers);
    for (uint i = 0; i < countUsers; i++) {
      User storage u = users[usersList[i]];
      us[i] = u;
    }
    return us;
  }

  function duplicatedUser(address _userId) public view returns (bool) {
    for(uint i=0; i < usersList.length; i++) {
      if(keccak256(abi.encodePacked(users[usersList[i]].id)) == keccak256(abi.encodePacked(_userId))){
        return true;
      }
    }
    return false;
  }


  function addProfessor(address _profId, string memory _nameProfessor) public {
    if(!duplicatedProfessor(_profId)){
      require(professors[_profId].id != _profId, "This professor already exists.");
      professors[_profId].id = _profId;
      professors[_profId].name = _nameProfessor;
      professorsList.push(_profId);
      countProfessors++;
      emit ProfessorAdded(_profId); 
    }
  }

  function getProfessors() public view returns(Professor[] memory) {
      Professor[] memory prof = new Professor[](countProfessors);
      for (uint i = 0; i < countProfessors; i++) {
        Professor storage p = professors[professorsList[i]];
        prof[i] = p;
      }
      return prof;
  }

  function duplicatedProfessor (address _profId) public view returns (bool) {
    for(uint i=0; i < professorsList.length; i++) {
      if(keccak256(abi.encodePacked(professors[professorsList[i]].id)) == keccak256(abi.encodePacked(_profId))){
        return true;
      }
    }
    return false;
  }

  function addSubject(string memory _nameSubject) public {    
    if(!duplicatedSubject(_nameSubject)){
      subjects.push(Subject(countSubject,_nameSubject));
      countSubject++;
      emit SubjectAdded(_nameSubject);
    }
  }

  function duplicatedSubject(string memory _nameSubject) public view returns (bool) {
    for(uint i=0; i < subjects.length; i++) {
      if(keccak256(abi.encodePacked(subjects[i].name)) == keccak256(abi.encodePacked(_nameSubject))){
        return true;
      }
    }
    return false;
  }

  function getSubjects() public view returns(Subject[] memory) {
    return subjects;
  }

  function getSubjectsOfProfessor(address _professorId) public view returns(Subject[] memory) {
    Subject[] memory sub = new Subject[](subjects.length);
      for (uint i = 0; i < professorsSubjects.length; i++) {
        if (professorsSubjects[i].professorId == _professorId) {
          for (uint256 k = 0; k < subjects.length; k++) {
            if (professorsSubjects[i].subjectId == subjects[k].id) {
                sub[i].id = professorsSubjects[i].subjectId;
                sub[i].name = subjects[k].name;
            }
          }
        }
      }
      return sub;
  }

  function getSenderRole() public view returns (string memory) {
    if (admins[msg.sender].id == msg.sender) {
      return "admin";
    } else if (users[msg.sender].id == msg.sender) {
      return "student";
    } else if (professors[msg.sender].id == msg.sender) {
      return "professor";
    } else {
      return "unknown";
    }
  }

  function getUserExists(address _userId) public view senderIsAdmin returns (bool) {
    return users[_userId].id == _userId;
  }

}
