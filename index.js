
let USERS_ID = 1;
let ORGANIZATION_ID = 1;
let BOARD_ID = 1;
let ISSUES_ID = 1;
const USERS =[{
    id: 1,
    username: 'john Doe',
    password: 'password123',
},
{
    id:2,
    username:"harry doe",
    password:"password123",
}
]
const ORGANIZATION =[{
    id: 1,
    title: 'Organization 1',
    description: 'This is the first organization.',
    admin: 1,
    members: [2]
},{
    id: 2,
    title   : 'Organization 2',
    description: 'This is the second organization.',
    admin: 1,
    members: []
}];
const BOARDS =[{
    id: 1,
    title: 'Board 1',
    organizationId: 1
}];

const ISSUES =[{
    id: 1,
    title: 'Issue 1',
    boardId: 1,
    state: "IN_PROGRESS",
},
{
    id: 2,
    title: 'Issue 2',
    boardId: 1,
    state: "TO_DO",
}];

const express = require('express');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('./middleware');
const app = express();
app.use(express.json());
const PORT = 3000;

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find(u => u.username === username);
    if (userExists) {
        res.status(411).json({
            message: "User with this username already exists"
        })
        return;
    }

    USERS.push({
        username,
        password,
        id: USERS_ID++
    })

    res.json({
        message: "You have signed up successfully"
    })

})

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find(u => u.username === username&& u.password === password);
    if(!userExists){
        res.status(401).json({
            message: "Invalid username or password"
        })
        return;
    }
   const token = jwt.sign({userId :userExists.id},"PRIVATE_KEY")
   res.json({
    message: "You have signed in successfully",
    token: token
   })
   
})

app.post("/organizations", authMiddleware,(req,res)=>{
    const userId = req.userId;
    const user = USERS.find(u => u.id === userId);
    if(!user){
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
    }
    const title = req.body.title;
    const description = req.body.description;
    ORGANIZATION.push({
        id: ORGANIZATION_ID++,
        title,
        description,
        admin: userId,
        members: []
    })
    res.json({
        message: "Organization created successfully",
        organization: ORGANIZATION_ID-1
    })
})
app.post("add-member-to-organization",authMiddleware,(req,res)=>{
    const userId = req.userId;
    const OrganizationId = req.body.organizationId;
    const memberId = req.body.memberId;
    const organization = ORGANIZATION.find(o => o.id === OrganizationId);
    if(!organization){
        res.status(404).json({
            message: "Organization not found"
        })
        return;
    }
    if(organization.admin !== userId){
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
    }
    const member = USERS.find(u => u.id === memberId);
    if(!member){
        res.status(404).json({
            message: "User not found"
        })
        return;
    }
    if(organization.members.includes(memberId)){
        res.status(400).json({
            message: "Member already exists in organization"
        })
        return;
    }
    organization.members.push(memberId);

    res.json({
        message: "Member added to organization successfully"
    })

})
app.post("/boards", authMiddleware, (req,res)=>{
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const title = req.body.title;

})
app.post("/delete-member-from-organization", authMiddleware, (req,res)=>{
    const userId = req.userId;
    const OrganizationId = req.body.organizationId;
    const memberId = req.body.memberId;
    const organization = ORGANIZATION.find(o => o.id === OrganizationId);
    if(!organization){
        res.status(404).json({
            message: "Organization not found"
        })
        return;
    }
    if(organization.admin !== userId){
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
    }
    const member = USERS.find(u => u.id === memberId);
    if(!member){
        res.status(404).json({
            message: "User not found"
        })
        return;
    }
    if(organization.members.includes(memberId)){
        res.status(400).json({
            message: "Member already exists in organization"
        })
        return;
    }
    organization.members= organization.members.filter(user=> user.id != memberId)
    
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
