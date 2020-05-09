const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

morgan.token('body', function (req, res) {
  if (Object.getOwnPropertyNames(req.body).length === 0) return null;

  return JSON.stringify(req.body);
});

// middlewares
app.use(express.json());
app.use(cors());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

// app.use(morgan('tiny'));

let persons = [
  {
    name: 'Ermi',
    number: '333',
    id: 5,
  },
  {
    name: 'Funu',
    number: '6666666666',
    id: 6,
  },
  {
    name: 'Boochoo',
    number: '123123123',
    id: 10,
  },
  {
    name: 'Funnnnnuuuuuu',
    number: '123412341234',
    id: 13,
  },
  {
    name: 'Jojo',
    number: '7373737',
    id: 12,
  },
];

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  return person ? res.json(person) : res.status(404).end();
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const generateId = (data) => {
  const maxId = data.length > 0 ? Math.max(...data.map((d) => d.id)) : 0;

  return maxId + 1;
};

app.post('/api/persons', (req, res) => {
  const body = req.body;
  const flag = (str) =>
    res.status(400).json({
      error: `${str}`,
    });

  const nameExists = (data) =>
    data.filter((p) => {
      return p.name === body.name;
    }).length > 0;

  if (!body.name) {
    return flag(`missing name`);
  } else if (!body.number) {
    return flag(`missing number`);
  } else if (nameExists(persons)) {
    return flag('duplicate name');
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(persons),
  };

  persons = persons.concat(newPerson);

  res.json(newPerson);
});

const infoContent = `
	<p>Phonebook has info of ${persons.length} people</p>
	<p>${new Date()}</p>
`;

app.get('/info', (req, res) => {
  res.send(infoContent);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, (req, res) => {
  console.log(`Server running on port ${PORT}`);
});
