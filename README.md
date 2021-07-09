# Meet-In-Room - Introduction
Meet-In-Room is a open source software which is focused in providing features to boost the productivity in an organisation. The software provides several features which will help employes of an organisation to interact with their teams and perform tasks efficiently. I built this software as my solution for Microsoft Engage Program 2020.

## Solution Functionalities
The software contains functionalities focused in hassle free organisation of workflow in an organisation. The software contains following functionalities :-

1. For security of information, users will have to first ```register``` and then can ```login``` in the application.
2. A ```user can create a team``` and ```add other members``` of their organistion in their team, this team can be used for conducting team meets where all members can join together through ```video calling```.
3. A ```chat``` feature where participants can ```start conversation before``` the meeting, which can be ```continued during and after the meet``` without disrupting the flow. (Built under Adopt Phase).
4. For better meeting experience, users can ```stop/ resume their video or audio``` during the meeting.
5. Use Participants tab to view ```list of Participants in Meeting```.
5. User can ```record and download the meeting``` .
6. User can assign tasks to their colleagues using ```Assign Work``` tab in the application.
7. Assignee can ```Accept```/ ```Reject``` the assigned work.

## Technology Stack Used
-  Javascript - Primary programming language
-  React.js - Frontend side library
-  Node.js - Backend javascript environment
-  Express - Web application framework
-  Firestore - As a database 
-  WebRTC
-  PeerJS

## Supporting Documents

### - High Level System Desgin of the Application
---

![full system design](https://github.com/ishivanshgoel/Meet-In-Room-Frontend/blob/master/docs/Full%20System%20Design.png)

The whole system is divided into 3 sub-categories namely Chat Service, Call Service and Work Service. Apart from that User Authentication acts as wall for accessing all the services in the application.
1. **Chat Service**: For reading old chats and to store new chats in database. Web Socket handler is used to manage events for real time chatting.
2. **Call Service**: Manages creation, updation of teams, add memebers to already existing team. Web Socket Handler is used to manage events involved for establishing peer-2-peer connection between users.
3. **Work Service**: For assigning work to users, fetching work assigned to any particular user, update status of assigned work.

### - How users connect in Peer-2-Peer connection
---
![full system design](https://github.com/ishivanshgoel/Meet-In-Room-Frontend/blob/master/docs/System%20Design.png)
Web Socket handler manages rooms, where the events are broadcasted as per requirement. 
To simulate it's working, let's assume that User 1, User 2 and User 3 are already connected in Room 1. Whenever some new user (User 5) requests web socket handler to join Room 1, it will broadcast a event (data: <-peer-id-of-User-5->) in Room 1 stating that User 5 wants to join. Then all the users will call User 5 individually, establishing a peer-2-peer connection.  

### - URL Pattern of the frontend application.
---

![full system design](https://github.com/ishivanshgoel/Meet-In-Room-Frontend/blob/master/docs/URL%20Mapper.png)

![full system design](https://github.com/ishivanshgoel/Meet-In-Room-Frontend/blob/master/docs/HLD%20Application%20Structure.png)
![full system design](https://github.com/ishivanshgoel/Meet-In-Room-Frontend/blob/master/docs/LLD%20Application%20Structure.png)

## Demo

## License
MIT License

Copyright (c) 2021 Shivansh Goel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.






