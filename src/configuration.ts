/* eslint-disable node/no-extraneous-import */
// eslint-disable-next-line node/no-unpublished-import
import 'tsconfig-paths/register';

import { App, Configuration, Logger } from '@midwayjs/decorator';
import * as swagger from '@midwayjs/swagger';
import { ILifeCycle } from '@midwayjs/core';
import { IMidwayLogger } from '@midwayjs/logger';
import { Application } from 'egg';
import { JaegerTracer } from 'jaeger-client';

import { customLogger } from './app/util/custom-logger';
import { initTracer } from './app/util/tracer';

@Configuration({
  imports: [
    '@midwayjs/orm', // 加载 orm 组件
    // 加载swagger组件
    {
      component: swagger,
      enabledEnvironment: ['local'],
    },
  ],
})
export class ContainerConfiguration implements ILifeCycle {
  @App()
  app: Application;

  @Logger()
  readonly logger: IMidwayLogger;

  private tracer: JaegerTracer;

  // 启动前处理
  async onReady(): Promise<void> {
    // 定制化日志
    customLogger(this.logger, this.app);
    // 初始化tracer单例
    this.tracer = initTracer(this.app);
  }

  // 可以在这里做些停止后处理
  async onStop(): Promise<void> {
    // 关闭tracer单例
    this.tracer.close();
  }
}
