import { throwError } from "../utils/index.ts";
import TypeHelper from "../utils/TypeHelper.ts";

export const ResourceClazzMap: Map<Function, any[]> = new Map();

/**
 * 修饰 class
 * @param props 实例化参数
 */
export function Resource(...props: any[]): Function {
  return function resource(target: Function): any {
    throwError(!TypeHelper.isFunction(target), "@Around only use on class.");

    ResourceClazzMap.set(target, Reflect.construct(target, props));
  };
}

/**
 * 将实例化后的类注入使用
 * @param resourceName 资源文件名
 */
export function Inject(resource: Function): Function {
  return function inject(
    target: Function,
    property: string,
    desc: PropertyDescriptor,
  ): any {
    if (!TypeHelper.isUndef(desc)) {
      throw new Error(
        `Please check @Inject()/${property} be used on Class's property.`,
      );
    }

    return {
      get() {
        const resourceClass = ResourceClazzMap.get(resource);

        throwError(!resourceClass, "Please check @Inject target is exists.");

        return resourceClass;
      },
    };
  };
}
