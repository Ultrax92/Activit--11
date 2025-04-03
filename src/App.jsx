import "./App.css";
import { Container, Row, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Le nom est obligatoire")
    .min(8, "Le nom doit contenir au moins 8 caractères")
    .max(15, "Le nom ne doit pas dépasser 15 caractères"),

  dueDate: yup
    .string()
    .required("La date est obligatoire")
    .matches(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Le format doit être jj/mm/aaaa"
    )
    .test("isFutureDate", "La date ne peut pas être dans le passé", (value) => {
      if (!value) return false;
      const [day, month, year] = value.split("/").map(Number);
      const inputDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate >= today;
    }),

  priority: yup
    .string()
    .oneOf(["Basse", "Moyenne", "Elevée"], "La priorité est invalide"),

  isCompleted: yup
    .boolean()
    .required("Ce champ est requis"),
});

function App() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      dueDate: "",
      priority: "Basse",
      isCompleted: false,
    },
    resolver: yupResolver(schema),
  });

  function onSubmit(formData) {
    console.log("Tâche soumise :", formData);
    reset();
  }

  return (
    <Container>
      <Row>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              placeholder="Saisir votre nom"
              {...register("name")}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="dueDate">
            <Form.Label>Date limite</Form.Label>
            <Form.Control
              type="text"
              placeholder="jj/mm/aaaa"
              {...register("dueDate")}
              isInvalid={!!errors.dueDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dueDate?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="priority">
            <Form.Label>Priorité</Form.Label>
            <Form.Select
              {...register("priority")}
              isInvalid={!!errors.priority}
            >
              <option value="Basse">Basse</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Elevée">Elevée</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.priority?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="isCompleted">
            <Form.Check
              type="checkbox"
              label="Tâche terminée ?"
              {...register("isCompleted")}
              isInvalid={!!errors.isCompleted}
            />
            <Form.Control.Feedback type="invalid">
              {errors.isCompleted?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            Ajouter
          </Button>
        </Form>
      </Row>
    </Container>
  );
}

export default App;
