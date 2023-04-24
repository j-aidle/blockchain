pragma solidity >0.8.0;

contract HistoryRecord {
    
    struct Record{
    	uint id;
    	address adminId;
    	address userId;
    	string nameSubject;
    	uint value;    	
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
    
   
    mapping (address => Admin) public admins;
    mapping (address => User) public users;
    
    event AdminAdded(address adminId);
    event UserAdded(address userId);
    event RecordAdded(uint id, address adminId, address userId); 
    event GradeAdded(address userId, string nameSubject, uint value); 
    
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
    
    function addRecord(uint _id, address _userId, string memory nameSubject, uint value) public senderIsAdmin userExists(_userId) {
      Record memory record = Record(_id, _userId, msg.sender,nameSubject, value, block.timestamp);
      users[_userId].records.push(record);

      emit RecordAdded(_id, _userId, msg.sender);
    } 
  
    function getRecords(address _userId) public view senderExists userExists(_userId) returns (Record[] memory) {
       return users[_userId].records;
    } 

    function getSenderRole() public view returns (string memory) {
      if (admins[msg.sender].id == msg.sender) {
        return "admin";
      } else if (users[msg.sender].id == msg.sender) {
        return "user";
      } else {
        return "unknown";
      }
    }

    function getUserExists(address _userId) public view senderIsAdmin returns (bool) {
      return users[_userId].id == _userId;
    }

}
