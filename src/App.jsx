import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Container, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ Schéma de validation avec Yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Le nom est requis")
    .min(8, "Le nom doit contenir au moins 8 caractères")
    .max(15, "Le nom ne doit pas dépasser 15 caractères"),
  dueDate: yup
    .string()
    .required("La date est requise")
    .matches(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Le format doit être jj/mm/aaaa"
    )
    .test(
      "isFuture",
      "La date ne peut pas être antérieure à aujourd’hui",
      (value) => {
        if (!value) return false;
        const [day, month, year] = value.split("/").map(Number);
        const inputDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return inputDate >= today;
      }
    ),
  priority: yup
    .string()
    .oneOf(["Basse", "Moyenne", "Élevée"], "La priorité est invalide"),
  isCompleted: yup.boolean().required("Le champ est requis"),
});

function App() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur", // ou "onChange" si tu veux valider en live
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Tâche soumise :", data);
    reset();
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Ajouter une tâche</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="taskName">
          <Form.Label>Nom de la tâche</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez un nom"
            {...register("name")}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="taskDueDate">
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

        <Form.Group className="mb-3" controlId="taskPriority">
          <Form.Label>Priorité</Form.Label>
          <Form.Select {...register("priority")} isInvalid={!!errors.priority}>
            <option value="Basse">Basse</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Élevée">Élevée</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.priority?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="taskIsCompleted">
          <Form.Check
            type="checkbox"
            label="Tâche complétée"
            {...register("isCompleted")}
            isInvalid={!!errors.isCompleted}
          />
          <Form.Control.Feedback type="invalid">
            {errors.isCompleted?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary">
          Ajouter
        </Button>
      </Form>
    </Container>
  );
}

export default App;
