CREATE DATABASE clica_e_sofre;
USE clica_e_sofre;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    turma VARCHAR(10),
    email VARCHAR(100),
    senha VARCHAR(100)
);

CREATE TABLE votos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    turma VARCHAR(10),
    chapa VARCHAR(50),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);