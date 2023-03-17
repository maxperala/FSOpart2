const Course = function ({ course }) {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total courses={course.parts} />
    </div>
  );
};

const Header = function (props) {
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
  );
};

const Content = function (props) {
  return (
    <ul>
      {props.parts.map((course) => (
        <Part nimi={course.name} tehtavat={course.exercises} key={course.id} />
      ))}
    </ul>
  );
};

const Part = function (props) {
  return (
    <>
      <li>
        {props.nimi} {props.tehtavat}
      </li>
    </>
  );
};

const Total = function (props) {
  const total = props.courses.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.exercises;
  }, 0);

  return <b>total of {total} excercises</b>;
};

export default Course;
