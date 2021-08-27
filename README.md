# Palindromes

Un palíndromo es una cadena de caracteres que leída de izquierda a derecha o de derecha a izquierda lee igual. Por ejemplo: "amor a roma".

Escribe un programa en Java, C, C++ o Python que lea, de entrada estándar, una cantidad variable de cadenas de caracteres e imprima a salida estándar "yes" cuando sí es un palíndromo; "no" de otra forma. El archivo debe llamarse `Solution`, p. ej.: `Solution.py`.

## Entrada

Una cantidad variable de cadenas de caracteres en a-zA-Z (no caracteres especiales), puede contener espacios en blanco.

## Salida

El método `isPalindrome` debe devolver:

- `yes` cuando la cadena es un palíndromo.
- `no`, cuando no lo es.

## Ejemplo

```text
┌─┬──────────────────┬──────────────────┬──────────────────┐
│#│Input             │Output            │Passed            │
├─┼──────────────────┼──────────────────┼──────────────────┤
│1│Amor a Roma       │yes               │YES               │
├─┼──────────────────┼──────────────────┼──────────────────┤
│2│Amor a Roma       │yes               |NO                │
│ │Salida a la casa  │no                │                  │
│ │Anita lava la tina│yes               │                  │
└─┴──────────────────┴──────────────────┴──────────────────┘
```

## Correr pruebas localmente

Verificar que se tenga node y npm instalados. Luego instalar las dependencias usando `npm install`.

Luego ejecutar:

```text
npm test
```