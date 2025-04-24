
import { ReactFlowProvider } from "reactflow";
import MindMapFlow from "./mind-map/MindMapFlow";
import "reactflow/dist/style.css";

const MindMap = () => {
  return (
    <div className="border rounded-lg overflow-hidden" style={{ height: '842px' }}>
      <ReactFlowProvider>
        <MindMapFlow />
      </ReactFlowProvider>
    </div>
  );
};

export default MindMap;
