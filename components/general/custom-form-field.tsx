import Image from "next/image";

import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  ControllerRenderProps,
} from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { HTMLInputTypeAttribute } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Switch } from "../ui/switch";
import { RadioGroup } from "@/components/ui/radio-group";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  SWITCH_DESCRIPTION = "switch_description",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  COLOR = "color",
  RADIO_GROUP = "radio_group",

  MULTI_COMBOBOX = "multi_combobox",
}
interface ComboboxOption {
  label: string;
  value: string;
}
interface CustomProps<T extends FieldValues> {
  id?: string;
  control: Control<T>;
  name: FieldPath<T>;
  inputMaxLength?: number;
  inputMinLength?: number;
  inputMax?: number;
  inputMin?: number;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (
    field: ControllerRenderProps<T, FieldPath<T>>,
  ) => React.ReactNode;
  fieldType?: FormFieldType;
  className?: string;
  containerClassName?: string;
  inputType?: HTMLInputTypeAttribute;
  comboboxItems?: ComboboxOption[];
}
type RenderInputProps<T extends FieldValues> = {
  inputType?: HTMLInputTypeAttribute;
  field: ControllerRenderProps<T, FieldPath<T>>;
  props: Omit<CustomProps<T>, "fieldType">;
  type: FormFieldType;
};
const RenderInput = <T extends FieldValues>({
  field,
  props,
  type,
  inputType,
}: RenderInputProps<T>) => {
  switch (type) {
    case FormFieldType.INPUT:
      return (
        <div className="bg-dark-400 flex rounded-md">
          <Field>
            <Input
              type={inputType}
              placeholder={
                (props.placeholder ?? "") != ""
                  ? props.placeholder
                  : props.label
              }
              id={props.id}
              minLength={props.inputMinLength}
              maxLength={props.inputMaxLength}
              onBlur={field.onBlur}
              disabled={props.disabled}
              value={field.value}
              min={props.inputMin}
              max={props.inputMax}
              onChange={(e) =>
                inputType == "number"
                  ? field.onChange(
                      isNaN(e.target.valueAsNumber)
                        ? undefined
                        : e.target.valueAsNumber,
                    )
                  : field.onChange(e)
              }
              className="text-sm placeholder:text-sm"
            />
          </Field>
        </div>
      );

    case FormFieldType.COLOR:
      return (
        <Popover modal={true}>
          <PopoverTrigger onBlur={field.onBlur}>
            <Button
              {...props}
              className="block"
              size="icon"
              style={{
                backgroundColor: field.value,
              }}
              variant="outline"
            >
              <div />
            </Button>
          </PopoverTrigger>
        </Popover>
      );

    case FormFieldType.TEXTAREA:
      return (
        <Field>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="bg-white text-sm placeholder:text-sm"
            disabled={props.disabled}
          />
        </Field>
      );

    case FormFieldType.CHECKBOX:
      return (
        <Field>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </Field>
      );
    case FormFieldType.SWITCH_DESCRIPTION:
      return (
        <Field>
          <div className="flex flex-row items-center justify-between gap-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <FieldLabel className="text-base">{props.label}</FieldLabel>
              <FieldDescription>{props.placeholder}</FieldDescription>
            </div>
            <Switch
              dir="rtl"
              disabled={props.disabled}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </div>
        </Field>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="">
          <Popover modal={true}>
            <PopoverTrigger>
              <Field>
                <Button
                  type="button"
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </Field>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date("1900-01-01")}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <Field className="w-full">
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="shad-select-trigger w-full">
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>

            <SelectContent className="shad-select-content">
              <SelectGroup>{props.children}</SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    case FormFieldType.RADIO_GROUP:
      return (
        <Field>
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="flex flex-col gap-2"
          >
            {props.children}
          </RadioGroup>
        </Field>
      );
    default:
      return null;
  }
};

const CustomFormField = <T extends FieldValues>(props: CustomProps<T>) => {
  const { fieldType = FormFieldType.INPUT, inputType, ...rest } = props;

  return (
    <Controller<T, FieldPath<T>>
      control={props.control}
      name={props.name}
      render={({ field, fieldState }) => {
        // if (
        //   fieldType == FormFieldType.INPUT ||
        //   fieldType == FormFieldType.TEXTAREA ||
        //   fieldType == FormFieldType.COLOR
        // ) {
        //   field.value = field.value ?? "";
        // }
        return (
          <div
            className={cn(
              "flex w-full flex-col gap-2",
              props.containerClassName,
            )}
          >
            <div className={cn("flex w-full flex-col gap-1", props.className)}>
              {fieldType !== FormFieldType.CHECKBOX &&
                fieldType !== FormFieldType.SWITCH_DESCRIPTION &&
                props.label && (
                  <FieldLabel className="text-sm font-medium text-zinc-500">
                    {props.label}
                  </FieldLabel>
                )}
              <RenderInput<T>
                inputType={inputType}
                field={field}
                type={fieldType}
                props={rest}
              />
            </div>
            <FieldError errors={[fieldState.error]} className="shad-error" />
          </div>
        );
      }}
    />
  );
};

export default CustomFormField;
