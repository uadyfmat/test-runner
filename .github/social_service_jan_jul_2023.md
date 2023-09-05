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

Also, not only it would be of use to the student, but the teacher too. The best outcome would be providing every teacher with an easy to configure application that can display metrics and give a broader point of view of the current state of their students, and then they could design a set of problems perfectly fit to polish their capacities, leading to a continuous process of monitoring and reinforcing.

Finally, it is important to mention that the requirements included that the professor should be able to post a set of exercises in a single repository and automatically test all of them every time a student uploaded their progress to their own repositories.

## The first approach

### Experiment

The idea was to test the usability and usefulness of the test runner. To do this, a classroom was created in github to publish a series of exercises that two groups of students would help us to solve and with this we could test the system. A task was automated in github, so that it would be executed when a student uploaded changes to its repository, the intention was to run the test-runner and thus know which exercises were solved correctly by the student and which were not.  Through a meeting and by sending emails, a link was shared with the students to access the classroom and thus generate their own repository, finally they were asked to generate the code that solved the exercises and to use the tool locally to validate their algorithms, in addition to asking them to upload their changes once they were finished.
The classroom was generated using the template provided in the official documentation [`uadyfmat/test-runner-plantilla-base`](https://github.com/uadyfmat/test-runner-plantilla-base)


### Results

After doing the first experiment we were left with some feedback:

- The students found very hard to install every required dependency.
- Many students had problems trying to execute Test-Runner.
- A lot of students didn't even try to solve the exercises, or at least generate their work repositories.
- The teachers required some data that the application wasn't able to generate.
- There was a strange problem with the GitHub actions that froze the tests to the point of reaching their maximum alive time, so their processes ended up being stopped.

## The second approach

### Creating a reader

> Rich - Mention the new objective, the requirements, what we got and link the repo.

### Current state

> Rich - Mention how we couldn't continue because of the job freezing issue.

## Future alternatives

- After carrying out an investigation, it was found that applying timeouts to the jobs could allow executing the rest of the task and thus knowing the results that are sought and preventing them from freezing.
- It is proposed to delve into the new options that Classroom is publishing for the automation of tests, currently some could have the same function without using the test-runner but the problem exists when multiple evaluations are required.
- The possibility of integrating test-runner as an extension for vscode is raised, it is believed that it would allow easier use and would save installation and other problems encountered, in this way the tool would be merely supportive.
