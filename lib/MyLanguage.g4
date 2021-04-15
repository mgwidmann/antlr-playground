grammar MyLanguage;

operation: left = number op right = number EOF;

number: val = INTEGER | val = DECIMAL;

op: PLUS | MINUS;

PLUS: '+';

MINUS: '-';

INTEGER: INT+;

DECIMAL: INT? '.' INT+;

fragment INT: [0-9]+;