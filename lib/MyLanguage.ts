import { AbstractParseTreeVisitor, ParseTreeVisitor } from "antlr4ts/tree";
import { NumberContext, OpContext, OperationContext } from "./generated/lib/MyLanguageParser";
import { MyLanguageVisitor as MyLanguageVisitorOriginal } from "./generated/lib/MyLanguageVisitor";

type Op = '+' | '-';

interface Operation {
  operator: Op;
  numbers: number[];
}

// These types are required in order to monkey patch the return type because of antlr4ts generation issue
type Modify<T, R> = Omit<T, keyof R> & R;
type MyLanguageVisitor<Result> = Modify<MyLanguageVisitorOriginal<Result>, {
  visitOperation?: (ctx: OperationContext) => Result; // Top level is ok to return `Result`
  visitNumber?: (ctx: NumberContext) => unknown; // All others should return unknown because it will be a sub-component of `Result`
  visitOp?: (ctx: OpContext) => unknown;
}>;

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