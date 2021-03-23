# Jobs and CronJobs

Usually the applications that run inside a Kubernetes cluster are expected to live long (and prosper). But there are a seperate class of objects that are meant to run once (`Jobs`) or only wake up every once a while (`CronJobs`) and run their course.

## Jobs

You can use a Kubernetes `Job` to run batch processes, ETL jobs, ad-hoc operations, etc. As soon as we submit this job manifest file to API server pod will kick in and execute a task. A Job creates one or more Pods and will continue to retry execution of the Pods until a specified number of them successfully terminate. As pods successfully complete, the Job tracks the successful completions. When a specified number of successful completions is reached, the task (ie, Job) is complete.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-with-timeout
spec:
  backoffLimit: 5
  activeDeadlineSeconds: 100
  template:
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

| Property              | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| backoffLimit          | The `backoffLimit` is used to specify the number of retries before considering a Job as failed. The back-off limit is set by default to 6. Failed Pods associated with the Job are recreated by the Job controller with an exponential back-off delay (10s, 20s, 40s ...) capped at six minutes. |
| activeDeadlineSeconds | The `activeDeadlineSeconds` applies to the duration of the job, no matter how many Pods are created. Once a Job reaches `activeDeadlineSeconds`, all of its running Pods are terminated and the Job status will become `type: Failed` with `reason: DeadlineExceeded`. |
| parallelism           | The number of pods running at any instant. Real number of running pods may be more or less than requested parallelism. |
| completions           | The number of pods that should successfully complete to consider `Job` successfully completed. |

## CronJobs

One CronJob object is like one line of a *crontab* (cron table) file. It runs a job periodically on a given schedule, written in [Cron](https://en.wikipedia.org/wiki/Cron) format. CronJobs are useful for creating periodic and recurring tasks, like running backups or sending emails. CronJobs can also schedule individual tasks for a specific time, such as scheduling a Job for when your cluster is likely to be idle.

A cron job creates a job object *about* once per execution time of its schedule. We say "about" because there are certain circumstances where two jobs might be created, or no job might be created. Therefore, jobs should be idempotent.

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: busybox
            imagePullPolicy: IfNotPresent
            command:
            - /bin/sh
            - -c
            - echo "$(date) -> Hello World!"
          restartPolicy: OnFailure
```

