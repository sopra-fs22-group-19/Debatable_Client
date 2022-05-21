# It's Debatable Client Repository
![logo](https://github.com/sopra-fs22-group-19/Debatable_Client/blob/master/src/images/logo2.png)
## Introduction
It's debatable is an online debate platform where users can debate with their friends and family. They can have debate on existing debate topics or they can create their own debate topics. Users can also see their ongoing debates, ended debates, debates which are waiting to be started, etc.

Once both participants join the debate room, participant 1 can start the debate. Each participant will get 30 seconds to defend their side. Debates arguments can be translated in 5 different laguages namely Chinese, English, German, Greek, Spanish. 

If second participant joined as a guest user, they do not have any access to any feature of It's debatable except participanting on the debate they have invited to. However, they do have right to end the debate.

## Technologies
We used Javascript, HTML, CSS, SCSS and React for frontend of It's debatable i.e. current git repository. We used Java in the backend of [It's debatable Server](https://github.com/sopra-fs22-group-19/Debatable_Server) repository. The other frameworks which we used in backend are Spring, Rest, Heroku (for deployment), SonarCloud (code quality). We had weekly Scrums and the implementation period was divided into 2 sprints.

## High-level Components
## Launch & Deployment
## Illustrations
Users can either login or register to the platform. They will see a home page. Users can join the debates using exiting debate topis as shown in the image below:


![Topics](https://github.com/sopra-fs22-group-19/Debatable_Client/blob/master/src/images/topics.png)


Users can filter the debates by clicking the filter button above. They can then choose any filter. Debates will be filtered accordingly. 


![Filter](https://github.com/sopra-fs22-group-19/Debatable_Client/blob/master/src/images/filter.png)


Users can also create a new debate topic using Create debate in the navigation bar.


![create](https://github.com/sopra-fs22-group-19/Debatable_Client/blob/master/src/images/create_debate.png)


Once users join the debate from topics, they will be redirected to debate room. Where they will see a invite button to invite second participant for the debate. They need to send the link to second participant. Second participant can join the debate by either login, register, or join as a guest. If user joins as guest, they don't have access to anything other than participating on that particular debate. Once second participant join, first participant can start the debate. Once the debate started, it will be chance of first participant to write their argument in 30 seconds time period. Participants can either post their answers by clicking enter button in their keyboard or clicking send button. If participant could not post their argument in 30 seconds, argument will posted automatically after 30 seconds. 


![debate_Started](https://github.com/sopra-fs22-group-19/Debatable_Client/blob/master/src/images/started_debate.png)

Both the participants can translate their or other participant's arguments in 5 different languages using translate button in the argument box. Both the participants can end the debate anytime using the end debate 


## Roadmap
Following are some features which would be nice additions:
### Debate viewers
It would be a nice addition to add viewers who can watch the debates.

### Debate Winner
Currently, there is no winner of the debates. Using the above feature and by upvoting and downvoting the arguments, debate winner can be decided.

### Debate Moderator
It would be nice if we can have a debate moderator who can try to keep the debating participants stick to the topic and can stop them from deviating.

### Live video mode of debating
In the current implementation, users type their arguments in the debate room. It would be nicer to have debates with people on live video mode.

## Authors
* [Orestis Oikonomou](https://github.com/oroikono)
* [Rupal Saxena](https://github.com/rupalsaxena)
* [Juan Bermeo](https://github.com/JdbermeoUZH)
* [Pablo Bolaños](https://github.com/pabsbo)
* [Chenfei Ma](https://github.com/chenfeimauzh)

## Acknowledgement
We would like to thank Prof. Dr. Thomas Fritz and his team of Software Praktikum (SoPra) - FS22 of University of Zurich for all the support. 

## License
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.