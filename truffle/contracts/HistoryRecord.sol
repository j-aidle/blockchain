pragma solidity >0.8.0;

contract HistoryRecord {
    
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

    struct ProfessorsStudents {
      uint id;
      address professorId;
      address studentId;
    }
    struct ProfessorsSubjects {
      uint id;
      address professorId;
      address subjectId;
    }
    struct StudentsSubjects {
      uint id;
      address studentId;
      address subjectId;
    }

    struct Grades {
      uint id;
      address studentId;
      address subjectId;
      uint value;
    }
    
   
    mapping (address => Admin) public admins;
    mapping (address => User) public users;
    mapping (address => Professor) public professors;
    mapping (uint => Subject) public subjects;
    mapping (uint => ProfessorsStudents) public professorsStudents;
    mapping (uint => ProfessorsSubjects) public professorsSubjects;
    mapping (uint => StudentsSubjects) public studentsSubjects;
    mapping (uint => Grades) public grades;

    event AdminAdded(address adminId);
    event UserAdded(address userId);
    event ProfessorAdded(address professorId);
    event RecordAdded(string subjectName, uint subjectValue, address userId, address adminId); 
    
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

    function addUser(address _userId) public senderIsAdmin {
      require(users[_userId].id != _userId, "This user already exists.");
      users[_userId].id = _userId;

      emit UserAdded(_userId);
    }

    function addAdmin() public {
      require(admins[msg.sender].id != msg.sender, "This admin already exists.");
      admins[msg.sender].id = msg.sender;

      emit AdminAdded(msg.sender);
    }

    function addProfessor(address _profId, string memory _nameProfessor) public {
      require(professors[_profId].id != _profId, "This professor already exists.");
      professors[_profId].id = _profId;
      professors[_profId].name = _nameProfessor;

      emit ProfessorAdded(_profId);
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
