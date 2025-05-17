import React from "react";
import { Modal, Button, Input, Tooltip, Spin, message } from "antd";
import {
  Formik,
  Form as FormikForm,
  Field,
  FieldArray,
  ErrorMessage,
} from "formik";
import * as Yup from "yup";
import { Rnd } from "react-rnd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { BannerModalProps } from "./interface";
import { LinkAreaType } from "../../pages/BannerManagementPage/interface";
import { cn } from "@/lib/util";

const MAX_LINKS = 7;

const validationSchema = Yup.object().shape({
  linkAreas: Yup.array().of(
    Yup.object().shape({
      link: Yup.string().url("URL wrong format").required("Required"),
    })
  ),
});

export const BannerModal: React.FC<BannerModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  imgRef,
  getImageSize,
  setSelectedId,
  snapToAvailable,
  selectedId,
  areaRefs,
  findEmptyPosition,
}) => {
  return (
    <Modal
      title={<p className="text-[20px]">Edit Hotspots</p>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1100}
      maskClosable={false}
      destroyOnClose
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, handleSubmit, errors, touched, isSubmitting }) => (
          <FormikForm onSubmit={handleSubmit}>
            <Spin spinning={isSubmitting} fullscreen></Spin>
            <div className="grid grid-cols-[700px_1fr] gap-4 content-start">
              <div className="w-[700px] relative mt-[30px] h-fit">
                <img
                  ref={imgRef}
                  src={values.imageUrl}
                  alt="cropped"
                  className="w-full h-auto"
                  draggable={false}
                />
                <FieldArray name="linkAreas">
                  {({ replace }) => (
                    <>
                      {values.linkAreas.map((area, index) => {
                        const { width, height } = getImageSize();
                        return (
                          <Rnd
                            key={area.id}
                            size={{
                              width: area.width * width,
                              height: area.height * height,
                            }}
                            position={{
                              x: area.x * width,
                              y: area.y * height,
                            }}
                            disableDragging={isSubmitting}
                            onClick={() => setSelectedId(area.id)}
                            onDragStop={(_, d) => {
                              const snap = snapToAvailable(
                                area.id,
                                d.x,
                                d.y,
                                area.width * width,
                                area.height * height,
                                values.linkAreas
                              );
                              if (snap) replace(index, { ...area, ...snap });
                            }}
                            onResizeStop={(_, __, ref, ___, pos) => {
                              const newW = parseInt(ref.style.width);
                              const newH = parseInt(ref.style.height);
                              const snap = snapToAvailable(
                                area.id,
                                pos.x,
                                pos.y,
                                newW,
                                newH,
                                values.linkAreas
                              );
                              if (snap)
                                replace(index, {
                                  ...area,
                                  ...snap,
                                  width: newW / width,
                                  height: newH / height,
                                });
                            }}
                            bounds="parent"
                            className={cn(
                              "border-2 border-dashed border-info z-[1]",
                              {
                                "bg-success/40 z-[10] border-success":
                                  selectedId === area.id,
                              }
                            )}
                          />
                        );
                      })}
                    </>
                  )}
                </FieldArray>
              </div>

              <div className="grid grid-cols-1 content-start">
                <h4 className="mb-[12px]">Link list</h4>
                <div className="max-h-[450px] overflow-y-auto">
                  <FieldArray name="linkAreas">
                    {({ remove, push }) => (
                      <>
                        {values.linkAreas.map((area, index) => (
                          <div
                            key={area.id}
                            ref={(el) => {
                              areaRefs.current[area.id] = el;
                            }}
                            className={cn(
                              "flex items-start gap-[8px] mb-[6px] p-[6px] border border-border border-dashed rounded-md",
                              {
                                "border-info bg-info/5": selectedId === area.id,
                              }
                            )}
                          >
                            <Field name={`linkAreas[${index}].link`}>
                              {({ field }: any) => (
                                <div className="flex flex-col w-full">
                                  <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isSubmitting}
                                    placeholder="เพิ่มลิงก์"
                                    onFocus={() => setSelectedId(area.id)}
                                    status={
                                      errors.linkAreas?.[index]?.link &&
                                      touched.linkAreas?.[index]?.link
                                        ? "error"
                                        : ""
                                    }
                                  />
                                  <ErrorMessage
                                    {...field}
                                    render={(msg) => (
                                      <div className="text-danger text-[12px] mt-[4px]">
                                        * {msg}
                                      </div>
                                    )}
                                  />
                                </div>
                              )}
                            </Field>
                            <Tooltip title="แสดง">
                              <Button
                                shape="circle"
                                icon={<EyeOutlined />}
                                size="small"
                                onClick={() => setSelectedId(area.id)}
                                disabled={isSubmitting}
                              />
                            </Tooltip>
                            <Tooltip title="ลบ">
                              <Button
                                shape="circle"
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                                onClick={(e) => {
                                  e.stopPropagation();
                                  remove(index);
                                  if (selectedId === area.id)
                                    setSelectedId(null);
                                }}
                                disabled={isSubmitting}
                              />
                            </Tooltip>
                          </div>
                        ))}
                        <button
                          type="button"
                          disabled={isSubmitting}
                          className={cn(
                            "border border-info border-dashed rounded-md text-center text-info hover:bg-info/10 transition-all duration-200 cursor-pointer w-full py-[6px]",
                            {
                              "cursor-not-allowed":
                                values.linkAreas.length >= MAX_LINKS,
                            }
                          )}
                          onClick={() => {
                            if (values.linkAreas.length >= MAX_LINKS) return;
                            const { width, height } = getImageSize();
                            const position = findEmptyPosition(
                              values.linkAreas
                            );
                            if (!position)
                              return message.error(
                                "พื้นที่ไม่เพียงพอ-ไม่สามารถเพิ่มจุดใส่ลิงก์ได้"
                              );
                            const newArea: LinkAreaType = {
                              id: Date.now().toString(),
                              x: position.x,
                              y: position.y,
                              width: 100 / width,
                              height: 60 / height,
                              link: "",
                            };
                            push(newArea);
                            setSelectedId(newArea.id);
                          }}
                        >
                          + เพิ่มจุดใส่ลิงก์({values.linkAreas.length}/
                          {MAX_LINKS})
                        </button>
                      </>
                    )}
                  </FieldArray>
                </div>
              </div>
            </div>

            <div className=" flex justify-end mt-4 gap-[8px]">
              <Button
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                loading={isSubmitting}
                disabled={isSubmitting}
                type="primary"
                htmlType="submit"
              >
                Save
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};
