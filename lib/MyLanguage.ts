import { AbstractParseTreeVisitor } from "antlr4ts/tree";
import { NumberContext, OpContext, OperationContext } from "./generated/lib/MyLanguageParser";
import { MyLanguageVisitor } from "./generated/lib/MyLanguageVisitor";

type Op = '+' | '-';

interface Operation {
  operator: Op;
  numbers: number[];
}

export class MyLangVisitor extends AbstractParseTreeVisitor<Operation> implements MyLanguageVisitor<Operation> {
  defaultResult(): Operation {
    throw new Error('No default result');
  }

  visitOperation(context: OperationContext): Operation {
    const left = this.visitNumber(context._left);
    const right = this.visitNumber(context._right);
    const op = this.visitOp(context.op());

    return {
      operator: op,
      numbers: [left, right]
    }
  }

  visitOp(context: OpContext): Op {
    if (context.text === '+' || context.text === '-') {
      return context.text;
    } else {
      throw new Error(`Cannot understand operation ${context.text}`);
    }
  }

  visitNumber(context: NumberContext): number {
    const num = Number(context._val.text);

    return num;
  }
}