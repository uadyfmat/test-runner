# Palindromes

Un palíndromo es una cadena de caracteres que leída de izquierda a derecha o de derecha a izquierda lee igual. Por ejemplo: "amor a roma".

Escribe un programa en Java, C, C++ o Python que lea una cadena de caracteres de entrada estándar e imprima a salida estándar "yes" cuando sí es un palíndromo; "no" de otra forma. El archivo debe llamarse `Solution`, p. ej.: `Solution.py`.

## Entrada

Una cadena de caracteres en a-zA-Z (no caracteres especiales), puede contener espacios en blanco.

## Salida

El método `isPalindrome` debe devolver:

- `yes` cuando la cadena es un palíndromo.
- `no`, cuando no lo es.

## Ejemplo

| Entrada (stdin) | Salida (stdout) |
|---|---|
|Amor a Roma|yes|
|La casa es grande|no|

## Correr pruebas localmente

Verificar que se tenga node y npm instalados. Luego instalar las dependencias usando `npm i`.

Luego ejecutar:

```text
npm test
```

La salida puede verse algo como lo siguiente:

```text
.-----------------------------------------.
| # |       Input       | Output | Passed |
|---|-------------------|--------|--------|
| 1 | Amor a Roma       | yes    | ❌      |
| 2 | La casa es grande | no     | ✔️     |
'-----------------------------------------'
```