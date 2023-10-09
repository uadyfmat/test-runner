# Social service overview (Jan - Jul 2023)

## Directory

- [About](#about)
- [The first approach](#the-first-approach)
  - [Experiment](#experiment)
  - [Results](#results)
- [The second approach](#the-second-approach)
  - [Creating a reader](#creating-a-reader)
  - [Current state](#current-state)
- [Future alternatives](#future-alternatives)

## About

The project, identified as "SISTEMA DE APOYO PARA EL APRENDIZAJE DE PROGRAMACIÓN PARA ESTUDIANTES CON PROBLEMAS DE REZAGO Y DESERCIÓN" and conducted by the Dr. Edgar Cambranez Martínez, appeared as a strategy to solve the necessity of helping those students that have been struggling to keep up with their classes by providing them with both a repository full of many different exercises and a tool that would help them by testing their code and printing their results.

Also, not only it would be of use to the student, but the teacher too. The best outcome would be providing every teacher with an easy to configure application that can display metrics and provide them with a broader point of view of the current state of their students. Then, they could design a set of problems to polish their abilities, leading to a continuous process of monitoring and reinforcing.

Finally, it is important to mention that the professor should be able to post their entire list of exercises in a single repository, as well as the system must automatically test all of them every time a student upload their progress into their own repository.

## The first approach

### Experiment

The idea was to test the usability and usefulness of Test Runner. To do this, an assignment was created in GitHub Classroom with a series of exercises that two groups of students would help us to solve and, with this, we were going to test the system. A task was automated in github, so that it would be executed when a student uploaded changes to its repository, the intention was to run Test Runner and thus know which exercises were solved correctly by the student and which were not.  Through a meeting and by sending emails, a link was shared with the students to access the classroom and generate their repository, finally, they were asked to code their answers and to use the tool locally to validate their algorithms, in addition to asking them to upload their changes once they finished.
The classroom was created using the template provided in the official documentation [`uadyfmat/test-runner-plantilla-base`](https://github.com/uadyfmat/test-runner-plantilla-base)


### Results

After doing the first experiment we were left with some feedback:

- The students found very hard to install every required dependency.
- Many students had problems trying to execute Test-Runner.
- A lot of students didn't even try to solve the exercises, or at least generate their work repositories.
- The teachers required some data that the application wasn't able to generate.
- There was a strange problem with the GitHub actions that froze the tests to the point of reaching their maximum alive time, so their processes ended up being stopped.

## The second approach

### Creating a reader

**Objective**

The new objective was to create an application that could get all the repositories from the students to generate a report for the teacher with a summary of the students' results.

**Requirements**
1. The application should be able to permit that the user enter his personal access token (with repository administration permissions).
2. The application should be able to permit that the user defines the CSV file's name.
3. The application should be able to read the data from the grades' CSV file that offers Github Classroom.
4. The application should be able to determine which are the repositories to consult from the data obtained from the grades' CSV file.
5. The application should be able to retrieve all the runs from a student's repository and get from them the following data:
    * Id
    * Event
    * Status
    * Conclusion
6. The application should be able to retrieve all the logs from the runs from a student's  repository.
7. The application should be able to determine, from the logs, the results obtained of a student in the validations of their exercises.
8. The application should be able to generate a grupal report that contains a summary of the students' results.
9. The application should be able to generate a report for each student that describes theirs results obtained from each run.
10. The application offers options to print in console the reports' results.

**What we got**

The application's development was almost finished, covering most of the proposed requirements. Its functionality consists first in asking the user's token and after entering it, the application asks the CSV file's name.

Once the CSV file's name is entered by the user, the application retrieve all the logs runs from each student's repository, along with the logs and finally, the results obtained of each student in the validations of their exercises.

With this information, as an output the application generates global report (as a txt file) that contains a summary of the students' results, and for each student it includes their username, their repository name and their grades. 

You can find this application's repository [here](https://github.com/uadyfmat/TestRunner-Log-Reader).
### Current state

At the moment, even if the development of the application was almost finished, the tests failed in the sense that the runs and jobs couldn't work properly, because when they were executed, they froze as they consumed all the maximum memory that Github actions has by default. As a result, we couldn't implement either the requirement #9.

## Future alternatives

- After carrying out an investigation, it was found that applying timeouts to the jobs could allow executing the rest of the task and thus knowing the results that are sought and preventing them from freezing.
- It is proposed to delve into the new options that Classroom is publishing for the automation of tests, currently some could have the same function without using the test-runner but the problem exists when multiple evaluations are required.
- The possibility of integrating test-runner as an extension for vscode is raised, it is believed that it would allow easier use and would save installation and other problems encountered, in this way the tool would be merely supportive.
> A new version has been released for test automation (at least the UI). It is recommended to explore again the possibilities it offers and whether any of them allow multiple evaluations.
