pragma solidity >0.8.0;

contract HistoryRecord {

  uint public countSubject=0;
  uint public countGrades=0;
  uint public countProfessors=0;
  uint public countUsers=0;

  Subject[] subjects;
  address[] professorsList;
  address[] usersList;

  struct Record{
    uint id;
    string subjectName;
    uint subjectValue; 
    address userId;
    address adminId;
    uint256 momentAddition;
  }  
      
  struct Admin {
      address id;
  }
  
  struct User {
      address id;
      string name;
      string surname;
      uint age;
      Record[] records;
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
    uint id;
    address studentId;
    address subjectId;
    uint value;
  }

  struct ProfessorsStudents {
    //uint id;
    address professorId;
    address studentId;
  }
  struct ProfessorsSubjects {
    //uint id;
    address professorId;
    uint subjectId;
  }
  struct StudentsSubjects {
   //uint id;
    address studentId;
    uint subjectId;
  }

  
  
  mapping (address => Admin) public admins;
  mapping (address => User) public users;
  mapping (address => Professor) public professors;
  mapping (uint => Grades) public grades;
  ProfessorsSubjects[] professorsSubjects;
  mapping (uint => ProfessorsStudents) public professorsStudents;
  //mapping (uint => ProfessorsSubjects) public professorsSubjects;
  mapping (uint => StudentsSubjects) public studentsSubjects;

  event AdminAdded(address adminId);
  event UserAdded(address userId);
  event ProfessorAdded(address professorId);
  event RecordAdded(string subjectName, uint subjectValue, address userId, address adminId); 
  event SubjectAdded(string nameSubject);
  event ProfessorSubjectsAdded(address _professorId,uint _subjectId);
  event ProfessorSubjectsDeleted(address _professorId,uint _subjectId);
  
  // modifiers

  modifier senderExists {
    require(admins[msg.sender].id == msg.sender || users[msg.sender].id == msg.sender, "Sender does not exist");
    _;
  }

  modifier userExists(address userId) {
    require(users[userId].id == userId, "User does not exist");
    _;
  }

  modifier senderIsAdmin {
    require(admins[msg.sender].id == msg.sender, "Sender is not an admin");
    _;
  }
  
  // functions
  function addProfessorSubjects(address _professorId, uint _subjectId) public {
    professorsSubjects.push(ProfessorsSubjects(_professorId,_subjectId));
    emit ProfessorSubjectsAdded(_professorId,_subjectId);
  }

  function deleteProfessorSubjects(address _professorId, uint _subjectId) public {
    for (uint i =0; i < professorsSubjects.length; i++) {
      if(professorsSubjects[i].professorId == _professorId && professorsSubjects[i].subjectId == _subjectId) {
        professorsSubjects[i] = professorsSubjects[professorsSubjects.length - 1];
      }
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
    require(users[_userId].id != _userId, "This user already exists.");
    users[_userId].id = _userId;
    users[_userId].name = _nameUser;
    usersList.push(_userId);
    countUsers++;
    emit UserAdded(_userId);
  }
  
  function getUsers() public view returns(User[] memory) {
    User[] memory us = new User[](countUsers);
    for (uint i = 0; i < countUsers; i++) {
      User storage u = users[usersList[i]];
      us[i] = u;
    }
    return us;
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
  
  function addRecord(string memory _subjectName,uint _subjectValue, address _userId) public senderIsAdmin userExists(_userId) {
    Record memory record = Record(getCountRecords(_userId),_subjectName, _subjectValue, _userId, msg.sender, block.timestamp);
    users[_userId].records.push(record);

    emit RecordAdded(_subjectName, _subjectValue, _userId, msg.sender);
  } 

  function getRecords(address _userId) public view senderExists userExists(_userId) returns (Record[] memory) {
      return users[_userId].records;
  } 

  function getSenderRole() public view returns (string memory) {
    if (admins[msg.sender].id == msg.sender) {
      return "admin";
    } else if (users[msg.sender].id == msg.sender) {
      return "user";
    } else if (professors[msg.sender].id == msg.sender) {
      return "professor";
    } else {
      return "unknown";
    }
  }

  function getUserExists(address _userId) public view senderIsAdmin returns (bool) {
    return users[_userId].id == _userId;
  }

  function getCountRecords(address _userId) public view returns(uint count) {
      return users[_userId].records.length;
  }


}
