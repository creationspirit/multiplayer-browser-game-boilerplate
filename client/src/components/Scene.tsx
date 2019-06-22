import * as BABYLON from 'babylonjs';
import React, { Component } from 'react';

export interface ISceneEventArgs {
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  canvas: HTMLCanvasElement | null;
}

export interface ISceneProps {
  engineOptions?: BABYLON.EngineOptions;
  adaptToDeviceRatio?: boolean;
  onSceneMount?: (args: ISceneEventArgs) => void;
  width?: string;
  height?: string;
}

export default class Scene extends Component<
  ISceneProps & React.HTMLAttributes<HTMLCanvasElement>,
  {}
> {
  private scene: BABYLON.Scene | null;
  private engine: BABYLON.Engine | null;
  private canvas: React.RefObject<HTMLCanvasElement>;

  constructor(props: ISceneProps) {
    super(props);
    this.scene = null;
    this.engine = null;
    this.canvas = React.createRef<HTMLCanvasElement>();
  }

  onResizeWindow = () => {
    if (this.engine) {
      this.engine.resize();
    }
  };

  shouldComponentUpdate(nextProps: ISceneProps, nextState: {}) {
    return false;
  }

  componentDidMount() {
    this.engine = new BABYLON.Engine(
      this.canvas.current,
      true,
      this.props.engineOptions,
      this.props.adaptToDeviceRatio
    );

    this.scene = new BABYLON.Scene(this.engine);

    if (typeof this.props.onSceneMount === 'function') {
      this.props.onSceneMount({
        scene: this.scene,
        engine: this.engine,
        canvas: this.canvas.current,
      });
    } else {
      console.error('onSceneMount function not available');
    }

    // Resize the babylon engine when the window is resized
    window.addEventListener('resize', this.onResizeWindow);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeWindow);
    (this.scene as BABYLON.Scene).dispose();
    (this.engine as BABYLON.Engine).dispose();
  }

  render() {
    // 'rest' can contain additional properties that you can flow through to canvas:
    // (id, className, etc.)
    const { width, height, ...rest } = this.props;

    const opts: any = {};

    if (width !== undefined && height !== undefined) {
      opts.width = width;
      opts.height = height;
    }

    return <canvas id="renderCanvas" {...opts} ref={this.canvas} />;
  }
}
