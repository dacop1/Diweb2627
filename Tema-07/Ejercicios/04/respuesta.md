## Respuestas

1. El texto tendrá color morado (purple) porque la regla `.mensaje.destacado` es la que se aplica.

2. El selector con mayor especificidad es `#principal p` porque contiene un ID.

3. Si eliminamos `#principal p`, el texto seguirá siendo morado gracias a `.mensaje.destacado`.

4. Si añadimos otra regla `.mensaje.destacado` al final, prevalecerá la última que aparezca.

5. Para evitar conflictos, es recomendable usar clases claras, evitar abusar de los ID y no duplicar reglas innecesarias.