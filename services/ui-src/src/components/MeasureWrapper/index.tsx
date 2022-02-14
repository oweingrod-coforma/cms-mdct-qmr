import * as CUI from "@chakra-ui/react";
import * as QMR from "components";
import { ReactElement, cloneElement, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Measure } from "measures/types";
import { useParams } from "react-router-dom";
import { useGetMeasure, useUpdateMeasure } from "hooks/api";
import { AutoCompletedMeasures, CoreSetAbbr, MeasureStatus } from "types";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

interface Props {
  measure: ReactElement;
  name: string;
  year: string;
  measureId: string;
  autocompleteOnCreation?: boolean;
}

export const MeasureWrapper = ({
  measure,
  name,
  year,
  measureId,
  autocompleteOnCreation,
}: Props) => {
  const navigate = useNavigate();
  const params = useParams();
  const [errors, setErrors] = useState<any[]>();
  const [validationFunctions, setValidationFunctions] = useState<Function[]>(
    []
  );

  const [showModal, setShowModal] = useState<boolean>(false);
  const autoCompletedMeasure =
    !!AutoCompletedMeasures[measureId as keyof typeof AutoCompletedMeasures];

  /*
  this is where we put all the high level stuff for measures
  this would include:
  - validating the route params (state, coreset)
  - querying the measure data
  - defining the update method
  - handing top level errors
  - loading states (maybe?)

  all of the methods defined here can be passed as props to every measure below
  */

  const { mutate: updateMeasure, isLoading: mutationRunning } =
    useUpdateMeasure();
  const {
    data: apiData,
    isLoading: loadingData,
    refetch,
  } = useGetMeasure({
    coreSet: params.coreSetId as CoreSetAbbr,
    measure: measureId,
  });
  const measureData = apiData?.Item;

  const methods = useForm<Measure.Form>({
    shouldUnregister: true,
    mode: "all",
    defaultValues: measureData?.data ?? undefined,
    criteriaMode: "firstError",
    shouldFocusError: true,
  });

  useEffect(() => {
    methods.reset(apiData?.Item?.data);
  }, [apiData, methods]);

  const handleValidation = (data: any) => {
    handleSave(data);
    validateAndSetErrors(data);
  };

  const handleSave = (data: any) => {
    if (!mutationRunning && !loadingData) {
      updateMeasure(
        { data, status: measureData?.status },
        {
          onSettled: (data, error) => {
            if (data && !error) {
              refetch();
            }
            //TODO: some form of error showcasing should display here
            if (error) console.log(error);
          },
        }
      );
    }
  };

  const handleClear = () => {
    submitDataToServer({
      data: {},
      status: MeasureStatus.INCOMPLETE,
      callback: () => {
        navigate(-1);
      },
    });
  };

  const handleSubmit = (data: any) => {
    const validatedErrors = validateAndSetErrors(data);

    if (validatedErrors) {
      setShowModal(true);
    } else {
      submitDataToServer({
        data,
        callback: () => {
          navigate(-1);
        },
      });
    }
  };

  const submitDataToServer = ({
    data,
    status = MeasureStatus.COMPLETE,
    callback,
  }: {
    data: any;
    status?: MeasureStatus;
    callback?: () => void;
  }) => {
    if (!mutationRunning && !loadingData) {
      updateMeasure(
        { data, status },
        {
          onSettled: (data, error) => {
            if (data && !error) {
              refetch();
              if (callback) {
                callback();
              }
            }

            //TODO: some form of error showcasing should display here
            if (error) console.log(error);
          },
        }
      );
    }
  };

  const validateAndSetErrors = (data: any): boolean => {
    const validationErrors = validationFunctions.reduce(
      (acc: any, current: any) => {
        const error = current(data);
        let errorArray = [];

        if (Array.isArray(error)) {
          errorArray = [...error];
        } else {
          errorArray = [error];
        }

        return error ? [...acc, ...errorArray] : acc;
      },
      []
    );

    setErrors(validationErrors.length > 0 ? validationErrors : undefined);
    return validationErrors.length > 0;
  };

  const handleValidationModalResponse = (continueWithErrors: boolean) => {
    setShowModal(false);

    if (continueWithErrors) {
      submitDataToServer({ data: methods.getValues() });
      setErrors(undefined);
    }
  };

  if (!params.coreSetId || !params.state) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <QMR.YesNoModalDialog
        isOpen={showModal}
        headerText="Validation Error"
        handleModalResponse={handleValidationModalResponse}
        bodyText="There are still errors on this measure, would you still like to complete?"
      />
      <QMR.StateLayout
        breadcrumbItems={[
          { path: `/${params.state}/${year}`, name: `FFY ${year}` },
          // This next path object is to bring the user back to the measures list with the back button
          {
            path: `/${params.state}/${year}/${params.coreSetId}`,
            name: "",
          },
          {
            path: `/${params.state}/${year}/${params.coreSetId}/${measureId}`,
            name: `${measureId} - ${name}`,
          },
        ]}
        buttons={
          // Using a ternary to appease type error instead of double &&
          !autoCompletedMeasure ? (
            <QMR.MeasureButtons
              isLoading={mutationRunning}
              handleSave={methods.handleSubmit(handleSave)}
              lastAltered={measureData?.data && measureData?.lastAltered}
              isSubmitted={measureData?.status === MeasureStatus.COMPLETE}
            />
          ) : undefined
        }
      >
        <CUI.Skeleton isLoaded={!loadingData}>
          <>
            <QMR.AdminMask />
            <form data-testid="measure-wrapper-form">
              <CUI.Container maxW="5xl" as="section">
                <CUI.Text fontSize="sm">
                  For technical questions regarding use of this application,
                  please reach out to MDCT_Help@cms.hhs.gov. For content-related
                  questions about measure specifications, or what information to
                  enter in each field, please reach out to
                  MACQualityTA@cms.hhs.gov.
                </CUI.Text>
                {cloneElement(measure, {
                  name,
                  year,
                  measureId,
                  setValidationFunctions,
                  //TODO: the current submission loading state should be passed down here for the additional submit button found at the bottom of forms
                  // whenever the buttons have a loading prop
                })}
                {!autocompleteOnCreation && (
                  <QMR.CompleteMeasureFooter
                    handleClear={methods.handleSubmit(handleClear)}
                    handleSubmit={methods.handleSubmit(handleSubmit)}
                    handleValidation={methods.handleSubmit(handleValidation)}
                  />
                )}
              </CUI.Container>
              {errors?.map((error, index) => (
                <QMR.Notification
                  key={uuidv4()}
                  alertProps={{ my: "3" }}
                  alertStatus="error"
                  alertTitle={`${error.errorLocation} Error`}
                  alertDescription={error.errorMessage}
                  close={() => {
                    const newErrors = [...errors];
                    newErrors.splice(index, 1);
                    setErrors(newErrors);
                  }}
                />
              ))}
            </form>
          </>
        </CUI.Skeleton>
      </QMR.StateLayout>
    </FormProvider>
  );
};
