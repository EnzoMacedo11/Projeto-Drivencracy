import { MongoClient, ObjectId } from "mongodb";
import dayjs from "dayjs";

import connectMongoDB from "../../db.js";
import enqueteschema from "../schemas/enqueteSchema.js";
import opçãoschema from "../schemas/opçãoVotoSchema.js";
import votoschema from "../schemas/votoSchema.js";

export async function CriarEnquete(req, res) {
  let { title, expireAt } = req.body;
  const data = { title, expireAt };
  const { error } = enqueteschema.validate(data, { abortEarly: false });

  if (error) {
    console.log(error);
    return res.status(422).send();
  }

  if (!expireAt) {
    let date30 = String(dayjs().add(30, "day").format("YYYY-MM-DD HH:mm"));
    expireAt = date30;
  }

  try {
    const database = await connectMongoDB();
    await database.collection("enquetes").insertOne({
      title: title,
      expireAt: expireAt,
    });
    const enqueteAtual = {
        title:title,
        expireAt: expireAt
    }
    res.status(201).json(enqueteAtual)
  } catch (err) {
    console.log(err);
  }
}

export async function ReceberEnquete(req, res) {
  const database = await connectMongoDB();
  const ListaEnquetes = await database.collection("enquetes").find().toArray();
  res.send(ListaEnquetes);
}

export async function Opções(req, res) {
  let { title, pollId } = req.body;
  const data = { title, pollId };
  const { error } = opçãoschema.validate(data, { abortEarly: false });

  if (error) {
    console.log(error);
    return res.status(422).send();
  }

  try {
    const database = await connectMongoDB();
    //const enquetes = await database.collection("enquetes");
    const opçãoexiste = await database.collection("opções").findOne({ title });
    if (opçãoexiste) {
      return res.status(409).send("Opção já existente");
    }

    const enqueteexistente = await database
      .collection("enquetes")
      .findOne({ _id: new ObjectId(pollId) });
    console.log(enqueteexistente);
    if (!enqueteexistente) {
      return res.status(404).send("Enquete não encontrada");
    }

    let validartempo = enqueteexistente.expireAt;
    let agora = dayjs();

    if (agora.isAfter(dayjs(validartempo))) {
      return res.status(403).send("Enquete expirada");
    }

    await database.collection("opções").insertOne({
      title: title,
      pollId: pollId,
      votes: 0,
    });
    const opçãoAtual = {
        title:title,
        pollId,pollId,
        votes: 0,
    }
    res.status(201).json(opçãoAtual);
  } catch (err) {
    console.log(err);
  }
}

export async function ReceberOpções(req, res) {
  const { id } = req.params;
  const database = await connectMongoDB();
  const ListaEnquetes = await database
    .collection("enquetes")
    .findOne({ _id: new ObjectId(id) });
  if (!ListaEnquetes) {
    return res.status(404).send();
  }
  try {
    const opções = await database
      .collection("opções")
      .find({ pollId: id })
      .toArray();
    res.send(opções);
  } catch (err) {
    console.log(err);
  }
}

export async function Voto(req, res) {
  const { id } = req.params;
  const database = await connectMongoDB();

  try {
    const opçãoexistente = await database
    .collection("opções")
    .findOne({ _id: new ObjectId(id) });
  const { votes } = opçãoexistente;
  console.log(opçãoexistente);
  const { pollId } = opçãoexistente;
  if (!opçãoexistente) {
    return res.status(404).send();
  }
  const enquetevalida = await database
    .collection("enquetes")
    .findOne({ _id: new ObjectId(pollId) });
  console.log(enquetevalida);
  const { expireAt } = enquetevalida;

  let validartempo = expireAt;
  let agora = dayjs();

  if (agora.isAfter(dayjs(validartempo))) {
    return res.status(403).send("Enquete expirada");
  }

    await database.collection("votos").insertOne({
      createAt: dayjs().format("YYYY-MM-DD HH:mm"),
      choiceId: new ObjectId(id),
      pollId: pollId,
    });
    let novosVotos = votes + 1;
    await database
      .collection("opções")
      .updateOne({ _id: new ObjectId(id) }, { $set: { votes: novosVotos } });
    res.status(201).send("Voto Enviado!");
  } catch (err) {
    console.log(err);
  }
  return res.send();
}

export async function Resultado(req, res) {
  const { id } = req.params;
  const database = await connectMongoDB();
  const enquete = await database
    .collection("enquetes")
    .findOne({ _id: new ObjectId(id) });

  if (!enquete) {
    return res.status(404);
  }
  const opções = await database
    .collection("opções")
    .find({ pollId: id })
    .toArray();
  console.log(opções);
  let maisVotado;
  let maisvotos = 0;

  for (let i = 0; i < opções.length; i++) {
    if (opções[i].votes > maisvotos) {
      maisVotado = opções[i];
    }
  }

  return res.json(maisVotado).send();
}
